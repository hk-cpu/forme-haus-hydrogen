/**
 * Tap Payments Webhook Route
 * ──────────────────────────
 * Server-to-server notification from Tap when a charge status changes.
 * Verifies the `hashstring` header via HMAC-SHA256 before trusting the body.
 *
 * Spec: https://developers.tap.company/docs/webhook
 *   hashstring = HMAC-SHA256(
 *     `${id}${formatted_amount}${currency}${gateway_ref||''}${payment_ref}${status}${created}`,
 *     TAP_SECRET_KEY,
 *   )
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

type TapChargePayload = {
  id?: string;
  status?: string;
  amount?: number | string;
  currency?: string;
  reference?: {
    gateway?: string | null;
    payment?: string | null;
    transaction?: string | null;
    order?: string | null;
  };
  transaction?: {created?: string | number};
  metadata?: {merchantTxId?: string; cartId?: string};
};

// Tap uses 2 decimals for most currencies and 3 for BHD/KWD/OMR/JOD/TND.
const THREE_DECIMAL_CURRENCIES = new Set(['BHD', 'KWD', 'OMR', 'JOD', 'TND']);

function formatAmount(amount: number | string, currency: string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return '0';
  const decimals = THREE_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? 3 : 2;
  return n.toFixed(decimals);
}

function buildHashInput(p: TapChargePayload): string {
  const id = p.id ?? '';
  const currency = (p.currency ?? '').toUpperCase();
  const amount = formatAmount(p.amount ?? 0, currency);
  const gateway = p.reference?.gateway ?? '';
  const payment = p.reference?.payment ?? '';
  const status = p.status ?? '';
  const created = p.transaction?.created ?? '';
  return `${id}${amount}${currency}${gateway}${payment}${status}${created}`;
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(message),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function action({request, context}: ActionFunctionArgs) {
  const {env} = context;
  const secretKey = env.TAP_SECRET_KEY;

  if (!secretKey) {
    return json({error: 'Webhook secret not configured'}, {status: 500});
  }

  const rawBody = await request.text();
  const received = request.headers.get('hashstring') || '';

  let payload: TapChargePayload;
  try {
    payload = JSON.parse(rawBody) as TapChargePayload;
  } catch {
    return json({error: 'Invalid JSON'}, {status: 400});
  }

  const expected = await hmacSha256Hex(secretKey, buildHashInput(payload));

  if (!received || !timingSafeEqualHex(expected, received.toLowerCase())) {
    console.error('[Tap Webhook] Invalid hashstring', {
      chargeId: payload.id,
      received: received.slice(0, 12) + '…',
    });
    return json({error: 'Invalid signature'}, {status: 401});
  }

  const status = payload.status?.toUpperCase();

  if (status === 'CAPTURED') {
    // Payment captured — Shopify order creation is handled by the hosted
    // checkout flow. Log for reconciliation with Tap dashboard.
    console.log('[Tap Webhook] Captured', {
      chargeId: payload.id,
      amount: payload.amount,
      currency: payload.currency,
      merchantTxId:
        payload.metadata?.merchantTxId ?? payload.reference?.transaction,
    });
  } else if (status) {
    console.log('[Tap Webhook] Status', {chargeId: payload.id, status});
  }

  return json({received: true}, {status: 200});
}

export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
