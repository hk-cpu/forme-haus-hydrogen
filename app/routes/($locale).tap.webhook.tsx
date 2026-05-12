/**
 * Tap Payments Webhook Route
 * ──────────────────────────
 * Server-to-server notification from Tap when a charge status changes.
 * Fires independently of the customer redirect, so it's the source of
 * truth for whether a payment really succeeded.
 *
 * Signature verification:
 *   Tap signs the body of every webhook with HMAC-SHA256 using
 *   TAP_WEBHOOK_SECRET. The signature is in the `hashstring` header,
 *   computed over the canonical string:
 *     x_id{id}x_amount{amount}x_currency{currency}x_gateway_reference{ref}
 *     x_payment_reference{ref}x_status{status}x_created{ts}
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

type TapWebhookPayload = {
  id?: string;
  status?: string;
  amount?: number;
  currency?: string;
  reference?: {
    transaction?: string;
    payment?: string;
    gateway?: string;
    order?: string;
  };
  metadata?: {merchantTxId?: string; cartId?: string};
  transaction?: {created?: string};
};

async function verifyTapSignature(
  payload: TapWebhookPayload,
  hashstring: string | null,
  secret: string,
): Promise<boolean> {
  if (!hashstring) return false;

  let formattedAmount = '';
  if (payload.amount !== undefined) {
    const threeDecimalCurrencies = ['BHD', 'KWD', 'OMR', 'JOD'];
    const decimals = threeDecimalCurrencies.includes(
      payload.currency?.toUpperCase() || '',
    )
      ? 3
      : 2;
    formattedAmount = Number(payload.amount).toFixed(decimals);
  }

  const canonical =
    `x_id${payload.id ?? ''}` +
    `x_amount${formattedAmount}` +
    `x_currency${payload.currency ?? ''}` +
    `x_gateway_reference${payload.reference?.gateway ?? ''}` +
    `x_payment_reference${payload.reference?.payment ?? ''}` +
    `x_status${payload.status ?? ''}` +
    `x_created${payload.transaction?.created ?? ''}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(canonical),
  );
  const computed = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computed === hashstring.toLowerCase();
}

export async function action({request, context}: ActionFunctionArgs) {
  const {env} = context;
  const webhookSecret = env.TAP_WEBHOOK_SECRET;

  let payload: TapWebhookPayload;
  try {
    payload = (await request.json()) as TapWebhookPayload;
  } catch {
    return json({error: 'Invalid JSON body'}, {status: 400});
  }

  if (webhookSecret) {
    const hashstring = request.headers.get('hashstring');
    const valid = await verifyTapSignature(payload, hashstring, webhookSecret);
    if (!valid) {
      console.warn('[Tap Webhook] Invalid signature for charge', payload.id);
      return json({error: 'Invalid signature'}, {status: 401});
    }
  } else {
    console.warn(
      '[Tap Webhook] TAP_WEBHOOK_SECRET not set — accepting unsigned webhook',
    );
  }

  const status = payload.status?.toUpperCase();
  console.log(
    `[Tap Webhook] charge=${payload.id} status=${status} amount=${payload.amount} ${payload.currency}`,
  );

  const adminToken =
    env.SHOPIFY_ADMIN_API_TOKEN || env.PRIVATE_STOREFRONT_API_TOKEN;
  const storeDomain = env.PUBLIC_STORE_DOMAIN;

  if (
    (status === 'CAPTURED' || status === 'AUTHORIZED') &&
    payload.metadata?.merchantTxId?.startsWith('DO-') &&
    adminToken &&
    storeDomain
  ) {
    const draftOrderId = payload.metadata.merchantTxId.replace('DO-', '');
    const isPending = status === 'AUTHORIZED' ? 'true' : 'false';
    try {
      const completeRes = await fetch(
        `https://${storeDomain}/admin/api/2024-10/draft_orders/${draftOrderId}/complete.json?payment_pending=${isPending}`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': adminToken,
            'Content-Type': 'application/json',
          },
        },
      );
      const completeData = (await completeRes.json()) as any;
      if (completeData.draft_order?.order_id) {
        console.log(
          `[Tap Webhook] Draft order completed autonomously: ${draftOrderId} -> Order ${completeData.draft_order.order_id}`,
        );
      } else {
        console.error(
          '[Tap Webhook] Draft order completion failed:',
          completeData,
        );
      }
    } catch (err) {
      console.error('[Tap Webhook] Draft order completion API error:', err);
    }
  }

  return json({received: true, status}, {status: 200});
}

export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
