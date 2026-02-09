import { type ActionFunctionArgs } from '@shopify/remix-oxygen';
import { json } from '@remix-run/server-runtime';

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email || typeof email !== 'string') {
        return json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const { data, errors } = await context.storefront.mutate(CUSTOMER_CREATE_MUTATION, {
            variables: {
                input: {
                    email,
                    acceptsMarketing: true,
                    emailMarketingConsent: {
                        marketingState: 'SUBSCRIBED',
                        marketingOptInLevel: 'SINGLE_OPT_IN',
                    },
                },
            },
        });

        if (errors) {
            console.error('Newsletter API Error:', errors);
            return json({ error: errors[0].message }, { status: 400 });
        }

        if (data?.customerCreate?.userErrors?.length) {
            // Check if error is "Email has already been taken" - if so, treat as success (already subscribed)
            const userErrors = data.customerCreate.userErrors;

            const emailTaken = userErrors.some((e: any) => e.message?.toLowerCase().includes('taken'));

            if (emailTaken) {
                return json({ success: true, message: 'You are already subscribed.' });
            }

            console.error('Customer Create Errors:', userErrors);
            return json({ error: userErrors[0].message }, { status: 400 });
        }

        return json({ success: true, message: 'Thank you for subscribing.' });
    } catch (error) {
        console.error('Newsletter API Exception:', error);
        return json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation newsletterCustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;
