/**
 * Tap Payments Checkout Initiation Route
 * ───────────────────────────────────────
 * Creates a Tap Payments charge and returns the redirect URL.
 *
 * Required environment variables:
 *   TAP_SECRET_KEY  — sk_test_... (test) or sk_live_... (production)
 *   TAP_API_URL     — https://api.tap.company/v2 (same for test/prod, key determines mode)
 *
 * Tap handles Mada, Visa, MC, AMEX, Apple Pay, STC Pay through one integration.
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {buildLocalePath, getPathLocalePrefix} from '~/lib/utils';

export async function action({request, context}: ActionFunctionArgs) {
  const {env} = context;
  const formData = await request.formData();

  const amount = formData.get('amount') as string;
  const currency = (formData.get('currency') as string) || 'SAR';
  const merchantTxId = formData.get('merchantTxId') as string;
  const shopperEmail = (formData.get('shopperEmail') as string) || '';
  const shopperName = (formData.get('shopperName') as string) || '';
  const shopperPhone = (formData.get('shopperPhone') as string) || '';
  const cartId = (formData.get('cartId') as string) || '';

  const secretKey = env.TAP_SECRET_KEY;
  const apiUrl = env.TAP_API_URL || 'https://api.tap.company/v2';

  if (!secretKey) {
    return json(
      {error: 'Tap Payments is not configured. Please contact support.'},
      {status: 500},
    );
  }

  if (!amount || isNaN(parseFloat(amount))) {
    return json({error: 'Invalid amount.'}, {status: 400});
  }

  // Determine origin for redirect URLs
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const localePrefix = getPathLocalePrefix(requestUrl.pathname);
  const tapWebhookPath = buildLocalePath('/tap/webhook', localePrefix);
  const tapCallbackPath = buildLocalePath('/tap/callback', localePrefix);

  // Build the Tap Payments charge request
  const chargePayload = {
    amount: parseFloat(amount),
    currency,
    customer_initiated: true,
    threeDSecure: true,
    save_card: false,
    description: `Forme Haus Order ${merchantTxId}`,
    metadata: {
      merchantTxId,
      cartId,
    },
    reference: {
      transaction: merchantTxId || `FH-${Date.now()}`,
      order: merchantTxId || `FH-${Date.now()}`,
    },
    receipt: {
      email: !!shopperEmail,
      sms: !!shopperPhone,
    },
    customer: {
      first_name: shopperName.split(' ')[0] || 'Customer',
      last_name: shopperName.split(' ').slice(1).join(' ') || '',
      email: shopperEmail || undefined,
      phone: shopperPhone
        ? {
            country_code: '966',
            number: shopperPhone.replace(/^\+966/, '').replace(/^0/, ''),
          }
        : undefined,
    },
    source: {id: 'src_all'}, // Accept all payment methods (Mada, Visa, MC, AMEX, Apple Pay, STC Pay)
    post: {
      url: `${origin}${tapWebhookPath}`, // Server-to-server notification
    },
    redirect: {
      url: `${origin}${tapCallbackPath}?merchantTxId=${encodeURIComponent(
        merchantTxId || '',
      )}`,
    },
  };

  try {
    const response = await fetch(`${apiUrl}/charges`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(chargePayload),
    });

    const data = (await response.json()) as {
      id?: string;
      status?: string;
      transaction?: {url?: string};
      errors?: Array<{code: number; description: string}>;
    };

    if (data.errors?.length) {
      console.error('Tap Payments initiate error:', data.errors);
      return json(
        {
          error:
            data.errors[0]?.description || 'Failed to create payment session.',
        },
        {status: 400},
      );
    }

    if (!data.transaction?.url) {
      console.error('Tap Payments: no redirect URL returned', data);
      return json({error: 'Failed to create payment session.'}, {status: 400});
    }

    return json({
      chargeId: data.id,
      redirectUrl: data.transaction.url,
      status: data.status,
    });
  } catch (err) {
    console.error('Tap Payments API exception:', err);
    return json({error: 'Payment service unavailable.'}, {status: 503});
  }
}

export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
