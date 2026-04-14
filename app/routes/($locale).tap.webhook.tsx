/**
 * Tap Payments Webhook Route
 * ──────────────────────────
 * Server-to-server notification from Tap when a charge status changes.
 * Configure this URL in your Tap dashboard under Developers → Webhooks:
 *   https://yourdomain.com/tap/webhook
 *
 * Tap sends a POST with the full charge object.
 * We return 200 quickly — heavy processing should be deferred.
 */

import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const payload = (await request.json()) as {
      id?: string;
      status?: string;
      amount?: number;
      currency?: string;
      customer?: {email?: string; first_name?: string; last_name?: string};
      metadata?: {merchantTxId?: string; cartId?: string};
      reference?: {transaction?: string; order?: string};
      receipt?: {id?: string; email?: string; sms?: string};
      response?: {code?: string; message?: string};
    };

    const status = payload.status?.toUpperCase();
    const chargeId = payload.id ?? 'unknown';
    const amount = payload.amount;
    const currency = payload.currency ?? 'SAR';
    const merchantTxId = payload.metadata?.merchantTxId ?? payload.reference?.transaction ?? '';

    console.log(`[Tap Webhook] charge=${chargeId} status=${status} amount=${amount} ${currency} txId=${merchantTxId}`);

    switch (status) {
      case 'CAPTURED': {
        // Payment confirmed — log and acknowledge
        // TODO: Create Shopify order via Admin API when credentials are available
        console.log(`[Tap Webhook] ✓ Payment captured — charge ${chargeId}, tx ${merchantTxId}`);
        break;
      }
      case 'FAILED':
      case 'DECLINED':
      case 'CANCELLED':
      case 'VOID': {
        console.log(`[Tap Webhook] ✗ Payment ${status} — charge ${chargeId}`);
        break;
      }
      default: {
        console.log(`[Tap Webhook] Status update: ${status} — charge ${chargeId}`);
      }
    }

    // Always return 200 quickly so Tap doesn't retry
    return json({received: true, chargeId, status}, {status: 200});
  } catch (err) {
    console.error('[Tap Webhook] Parse error:', err);
    // Return 200 anyway — a 4xx/5xx would cause Tap to retry indefinitely
    return json({received: true}, {status: 200});
  }
}

export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
