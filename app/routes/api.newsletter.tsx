import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@remix-run/server-runtime';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return json({error: 'Email is required'}, {status: 400});
  }

  try {
    const {data, errors}: any = await context.storefront.mutate(
      CUSTOMER_CREATE_MUTATION,
      {
        variables: {
          input: {
            email,
            password: crypto.randomUUID(),
            acceptsMarketing: true,
          } as any,
        },
      },
    );

    if (errors) {
      console.error('Newsletter API Error:', errors);
      return json({error: errors[0].message}, {status: 400});
    }

    if (data?.customerCreate?.customerUserErrors?.length) {
      const userErrors = data.customerCreate.customerUserErrors;

      // "Email has already been taken" → treat as success (already subscribed)
      const emailTaken = userErrors.some((e: any) =>
        e.message?.toLowerCase().includes('taken'),
      );

      if (emailTaken) {
        return json({success: true, message: 'You are already subscribed.'});
      }

      console.error('Customer Create Errors:', userErrors);
      return json({error: userErrors[0].message}, {status: 400});
    }

    await notifyOwner(email, context.env);
    return json({success: true, message: 'Thank you for subscribing.'});
  } catch (error) {
    console.error('Newsletter API Exception:', error);
    return json(
      {error: 'Failed to subscribe. Please try again.'},
      {status: 500},
    );
  }
}

async function notifyOwner(email: string, env: unknown) {
  const e = env as Record<string, string | undefined>;
  const webhookUrl = e.STORE_NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        event: 'newsletter_signup',
        email,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-blocking — owner notification failure should not affect subscriber
  }
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation newsletterCustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        field
        message
      }
    }
  }
` as const;
