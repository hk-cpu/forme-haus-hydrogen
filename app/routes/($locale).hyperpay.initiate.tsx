/**
 * HyperPay Checkout Initiation Route
 * ────────────────────────────────────
 * Called via useFetcher from the cart when the user clicks "Pay with HyperPay".
 * Creates a HyperPay checkout session and returns the checkoutId to the client.
 *
 * Required environment variables (add to .env + Oxygen/Shopify env):
 *   HYPERPAY_ACCESS_TOKEN   — your HyperPay API access token
 *   HYPERPAY_ENTITY_ID_MADA — entity ID for mada brand (from HyperPay dashboard)
 *   HYPERPAY_ENTITY_ID_CARD — entity ID for Visa/Mastercard/Amex
 *   HYPERPAY_ENTITY_ID_STCPAY — entity ID for STC Pay (optional)
 *   HYPERPAY_BASE_URL       — https://eu-test.oppwa.com (test) or https://eu-prod.oppwa.com (prod)
 *
 * Shopify Hydrogen: the cart total comes from the cart stored in the session.
 * We pass it from the client via formData to avoid an extra cart query here.
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

// ─── HyperPay brand → entity ID mapping ──────────────────────────────────────
function getEntityId(
  brand: string,
  env: Record<string, string | undefined>,
): string {
  switch (brand.toUpperCase()) {
    case 'MADA':
      return env.HYPERPAY_ENTITY_ID_MADA ?? '';
    case 'STC':
    case 'STCPAY':
      return env.HYPERPAY_ENTITY_ID_STCPAY ?? env.HYPERPAY_ENTITY_ID_CARD ?? '';
    default:
      // VISA, MASTER, AMEX
      return env.HYPERPAY_ENTITY_ID_CARD ?? '';
  }
}

// ─── Action ───────────────────────────────────────────────────────────────────
export async function action({request, context}: ActionFunctionArgs) {
  const env = (context.env as unknown) as Record<string, string | undefined>;
  const formData = await request.formData();

  const amount = formData.get('amount') as string;
  const currency = (formData.get('currency') as string) || 'SAR';
  const brand = (formData.get('brand') as string) || 'CARD';
  const merchantTxId = formData.get('merchantTxId') as string;
  const shopperEmail =
    (formData.get('shopperEmail') as string | null) || undefined;
  const shopperName =
    (formData.get('shopperName') as string | null) || undefined;

  // Validate required config
  const accessToken = env.HYPERPAY_ACCESS_TOKEN;
  const baseUrl = env.HYPERPAY_BASE_URL ?? 'https://eu-test.oppwa.com';
  const entityId = getEntityId(brand, env);

  if (!accessToken || !entityId) {
    return json(
      {error: 'HyperPay is not configured. Please contact support.'},
      {status: 500},
    );
  }

  if (!amount || isNaN(parseFloat(amount))) {
    return json({error: 'Invalid amount.'}, {status: 400});
  }

  // Build form-encoded body for HyperPay API
  const params = new URLSearchParams({
    'authentication.accessToken': accessToken,
    'authentication.entityId': entityId,
    amount: parseFloat(amount).toFixed(2),
    currency,
    paymentType: 'DB',
    merchantTransactionId: merchantTxId || `FH-${Date.now()}`,
  });

  if (shopperEmail) params.set('customer.email', shopperEmail);
  if (shopperName) {
    const [first, ...rest] = shopperName.split(' ');
    params.set('customer.givenName', first);
    if (rest.length) params.set('customer.surname', rest.join(' '));
  }

  try {
    const response = await fetch(`${baseUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: params.toString(),
    });

    const data = (await response.json()) as {
      id?: string;
      result?: {code: string; description: string};
    };

    // HyperPay success codes start with "000.200"
    if (!data.id || !data.result?.code?.startsWith('000.200')) {
      console.error('HyperPay initiate error:', data);
      return json(
        {
          error:
            data.result?.description || 'Failed to create payment session.',
        },
        {status: 400},
      );
    }

    return json({
      checkoutId: data.id,
      baseUrl,
      brand: brand.toUpperCase(),
    });
  } catch (err) {
    console.error('HyperPay API exception:', err);
    return json({error: 'Payment service unavailable.'}, {status: 503});
  }
}

// No loader — this is action-only
export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
