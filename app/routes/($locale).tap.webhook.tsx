/**
 * Tap Payments Webhook Route
 * ──────────────────────────
 * Server-to-server notification from Tap when a charge status changes.
 * This fires independently of the customer redirect.
 *
 * In production, you should:
 * 1. Verify the webhook signature using TAP_WEBHOOK_SECRET
 * 2. Create/update the Shopify order via Admin API
 * 3. Send order confirmation email
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

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

    if (status === 'CAPTURED') {
      // Payment captured — Shopify order creation handled by Shopify checkout integration
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
