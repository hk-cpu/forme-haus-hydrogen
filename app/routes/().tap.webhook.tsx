/**
 * Tap Payments Webhook Route
 * ──────────────────────────
 * Server-to-server notification from Tap when charge status changes.
 * Acts as a fallback: if the customer closed the browser before the callback
 * rendered, this ensures the Shopify order still gets created.
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

async function createShopifyOrderFromWebhook(
  storeDomain: string,
  adminToken: string,
  payload: {
    id: string;
    amount: number;
    currency: string;
    metadata?: {merchantTxId?: string; cartId?: string};
  },
): Promise<void> {
  // Minimal order — no line items since cart may be gone.
  // Creates a pending manual order with payment info for merchant to fulfill.
  const order = {
    order: {
      financial_status: 'paid',
      transactions: [
        {
          kind: 'sale',
          status: 'success',
          amount: String(payload.amount),
          currency: payload.currency,
          gateway: 'Tap Payments',
          authorization: payload.id,
        },
      ],
      note: `Webhook order. Tap Charge: ${payload.id}. Ref: ${payload.metadata?.merchantTxId ?? ''}. Cart: ${payload.metadata?.cartId ?? ''}`,
      tags: 'tap-payment,webhook-created',
    },
  };

  try {
    const res = await fetch(
      `https://${storeDomain}/admin/api/2024-10/orders.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(order),
      },
    );
    const body = (await res.json()) as {order?: {id: number; name: string}};
    if (body.order) {
      console.log(`[Tap Webhook] Shopify order created: ${body.order.name} (${body.order.id})`);
    }
  } catch (err) {
    console.error('[Tap Webhook] Shopify order creation failed:', err);
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const {env} = context;

  try {
    const payload = (await request.json()) as {
      id?: string;
      status?: string;
      amount?: number;
      currency?: string;
      metadata?: {merchantTxId?: string; cartId?: string};
      reference?: {transaction?: string};
    };

    const status = payload.status?.toUpperCase();
    console.log(`[Tap Webhook] ${payload.id} → ${status}`);

    if (status === 'CAPTURED' && payload.id) {
      const adminToken = env.SHOPIFY_ADMIN_API_TOKEN;
      const storeDomain = env.PUBLIC_STORE_DOMAIN;

      // Only create via webhook if Admin API is configured.
      // The callback route is the primary path; this is the safety net.
      if (adminToken && storeDomain) {
        await createShopifyOrderFromWebhook(storeDomain, adminToken, {
          id: payload.id,
          amount: payload.amount ?? 0,
          currency: payload.currency ?? 'SAR',
          metadata: payload.metadata,
        });
      }
    }

    return json({received: true}, {status: 200});
  } catch (err) {
    console.error('[Tap Webhook] Error:', err);
    return json({error: 'Webhook processing failed'}, {status: 500});
  }
}

export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
