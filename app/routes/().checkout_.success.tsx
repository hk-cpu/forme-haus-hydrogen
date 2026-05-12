/**
 * Tap Payments Callback Route
 * ────────────────────────────
 * Tap redirects here after customer completes/cancels payment.
 * On CAPTURED: creates a real Shopify order via Admin API and shows confirmation.
 *
 * URL: /tap/callback?tap_id={chargeId}&merchantTxId={ref}
 */

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';
import {motion} from 'framer-motion';

import {buildLocalePath, getPathLocalePrefix} from '~/lib/utils';
import {
  getCheckoutData,
  clearCheckoutData,
  markOrderCreated,
} from '~/lib/checkout.server';
import {sendOrderConfirmation} from '~/lib/email.server';

// ── Shopify Order Creation ────────────────────────────────────────────────────
async function createShopifyOrder(
  storeDomain: string,
  adminToken: string,
  data: {
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    address: {
      line1: string;
      line2?: string;
      city: string;
      country: string;
      countryCode: string;
      zip?: string;
    };
    cartLines: Array<{
      variantId: string;
      quantity: number;
      price: string;
      title: string;
    }>;
    total: string;
    currency: string;
    merchantTxId: string;
    tapChargeId: string;
    paymentMethod?: string;
    acceptsMarketing: boolean;
  },
): Promise<{id?: string; name?: string; error?: string}> {
  const extractId = (gid: string) => {
    const parts = gid.split('/');
    return parseInt(parts[parts.length - 1], 10);
  };

  const lineItems = data.cartLines.map((l) => ({
    variant_id: extractId(l.variantId),
    quantity: l.quantity,
    price: l.price,
    title: l.title,
  }));

  const payload = {
    order: {
      line_items: lineItems,
      financial_status: 'paid',
      transactions: [
        {
          kind: 'sale',
          status: 'success',
          amount: data.total,
          currency: data.currency,
          gateway: 'Tap Payments',
          authorization: data.tapChargeId,
        },
      ],
      buyer_accepts_marketing: data.acceptsMarketing,
      customer: {
        email: data.contact.email,
        first_name: data.contact.firstName,
        last_name: data.contact.lastName,
        phone: data.contact.phone,
        accepts_marketing: data.acceptsMarketing,
      },
      email_marketing_consent: {
        state: data.acceptsMarketing ? 'subscribed' : 'not_subscribed',
        opt_in_level: 'single_opt_in',
      },
      shipping_address: {
        first_name: data.contact.firstName,
        last_name: data.contact.lastName,
        address1: data.address.line1,
        address2: data.address.line2 ?? '',
        city: data.address.city,
        country: data.address.country,
        country_code: data.address.countryCode,
        zip: data.address.zip ?? '',
        phone: data.contact.phone,
      },
      note: `Paid via Tap Payments. Charge ID: ${data.tapChargeId}. Ref: ${data.merchantTxId}`,
      tags: 'tap-payment,online',
      send_receipt: false,
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
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      },
    );
    const body = (await res.json()) as {
      order?: {id: number; name: string};
      errors?: unknown;
    };
    if (body.order) {
      console.log(
        `[Tap Callback] Shopify order created: ${body.order.name} (${body.order.id})`,
      );
      return {id: String(body.order.id), name: body.order.name};
    }
    if (body.errors) {
      console.error(
        '[Tap Callback] Shopify order creation failed:',
        body.errors,
      );
      return {
        error:
          typeof body.errors === 'string'
            ? body.errors
            : JSON.stringify(body.errors),
      };
    }
    return {error: 'Order creation failed'};
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      console.warn(
        '[Tap Callback] Shopify order creation timed out, letting webhook handle it.',
      );
      return {};
    }
    console.error('[Tap Callback] Shopify order API error:', err);
    return {error: err instanceof Error ? err.message : 'Order creation error'};
  }
}

// ── Shopify Draft Order Completion ────────────────────────────────────────────
async function completeDraftOrder(
  storeDomain: string,
  adminToken: string,
  draftOrderId: string,
  tapChargeId: string,
  chargeStatus: string,
): Promise<{id?: string; name?: string; error?: string}> {
  try {
    // First, check if the draft order is already completed
    const getRes = await fetch(
      `https://${storeDomain}/admin/api/2024-10/draft_orders/${draftOrderId}.json`,
      {
        headers: {'X-Shopify-Access-Token': adminToken},
        signal: AbortSignal.timeout(4000),
      },
    );
    const getData = (await getRes.json()) as any;

    if (getData.draft_order?.order_id) {
      const orderId = getData.draft_order.order_id;
      const orderRes = await fetch(
        `https://${storeDomain}/admin/api/2024-10/orders/${orderId}.json`,
        {
          headers: {'X-Shopify-Access-Token': adminToken},
          signal: AbortSignal.timeout(4000),
        },
      );
      const orderData = (await orderRes.json()) as any;
      return {id: String(orderId), name: orderData.order?.name};
    }

    const isPending = chargeStatus === 'AUTHORIZED' ? 'true' : 'false';
    const completeRes = await fetch(
      `https://${storeDomain}/admin/api/2024-10/draft_orders/${draftOrderId}/complete.json?payment_pending=${isPending}`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(4500),
      },
    );
    const completeData = (await completeRes.json()) as any;
    if (completeData.draft_order?.order_id) {
      const orderId = completeData.draft_order.order_id;

      const orderRes = await fetch(
        `https://${storeDomain}/admin/api/2024-10/orders/${orderId}.json`,
        {
          headers: {'X-Shopify-Access-Token': adminToken},
          signal: AbortSignal.timeout(4000),
        },
      );
      const orderData = (await orderRes.json()) as any;
      console.log(
        `[Tap Callback] Shopify draft order completed: ${orderData.order?.name} (${orderId})`,
      );
      return {id: String(orderId), name: orderData.order?.name};
    }
    return {error: JSON.stringify(completeData.errors)};
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      console.warn(
        `[Tap Callback] Shopify API timed out for Draft Order ${draftOrderId}. Let webhook complete it.`,
      );
      return {}; // Gracefully return without error, UI will show generic success
    }
    console.error('[Tap Callback] Draft completion error:', err);
    return {
      error: err instanceof Error ? err.message : 'Draft completion error',
    };
  }
}

// ── Loader ────────────────────────────────────────────────────────────────────
export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tapId = url.searchParams.get('tap_id');
  const merchantTxId = url.searchParams.get('merchantTxId') ?? '';
  const localePrefix = getPathLocalePrefix(url.pathname);

  const {env, session} = context;
  const secretKey = env.TAP_SECRET_KEY;
  const apiUrl = env.TAP_API_URL ?? 'https://api.tap.company/v2';
  const adminToken =
    env.SHOPIFY_ADMIN_API_TOKEN || env.PRIVATE_STOREFRONT_API_TOKEN;
  const storeDomain = env.PUBLIC_STORE_DOMAIN;

  if (!tapId) {
    return json({
      status: 'error' as const,
      message: 'No payment reference found.',
    });
  }

  if (!secretKey) {
    return json({
      status: 'error' as const,
      message: 'Payment gateway not configured.',
    });
  }

  // Log whether Admin API is configured — helpful for debugging
  if (!adminToken) {
    console.warn(
      '[Tap Callback] SHOPIFY_ADMIN_API_TOKEN not set — orders will NOT be created in Shopify.',
    );
  }

  try {
    const res = await fetch(`${apiUrl}/charges/${tapId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: 'application/json',
      },
    });

    const data = (await res.json()) as {
      id?: string;
      status?: string;
      amount?: number;
      currency?: string;
      receipt?: {id?: string};
      reference?: {transaction?: string; order?: string};
      source?: {payment_method?: string};
      response?: {code?: string; message?: string};
    };

    console.log(`[Tap Callback] tap_id=${tapId} status=${data.status}`);

    const chargeStatus = data.status?.toUpperCase();

    if (chargeStatus === 'CAPTURED' || chargeStatus === 'AUTHORIZED') {
      // Retrieve checkout session data saved before the Tap redirect
      const checkoutData = getCheckoutData(session);
      let orderName: string | undefined;
      let shopifyOrderId: string | undefined;
      let orderError: string | undefined;

      // Ensure we extract merchantTxId properly, falling back to session if URL is missing it
      const actualMerchantTxId =
        data.reference?.transaction ??
        merchantTxId ??
        checkoutData?.merchantTxId;

      if (adminToken && storeDomain && actualMerchantTxId) {
        let orderResult;

        if (actualMerchantTxId.startsWith('DO-')) {
          const draftOrderId = actualMerchantTxId.replace('DO-', '');
          orderResult = await completeDraftOrder(
            storeDomain,
            adminToken,
            draftOrderId,
            tapId,
            chargeStatus,
          );
        } else if (checkoutData && !checkoutData.orderCreated) {
          orderResult = await createShopifyOrder(storeDomain, adminToken, {
            contact: checkoutData.contact,
            address: checkoutData.address,
            cartLines: checkoutData.cartLines,
            total: checkoutData.total,
            currency: checkoutData.currency,
            merchantTxId: checkoutData.merchantTxId,
            tapChargeId: tapId,
            paymentMethod: data.source?.payment_method,
            acceptsMarketing: checkoutData.acceptsMarketing ?? false,
          });
        }

        if (orderResult?.name) {
          orderName = orderResult.name;
          shopifyOrderId = orderResult.id;
          markOrderCreated(session, orderResult.id ?? '');

          // Send branded confirmation email — strictly formehaus.me links only
          const resendKey = (env as any).RESEND_API_KEY as string | undefined;
          if (resendKey && checkoutData && checkoutData.contact.email) {
            sendOrderConfirmation(resendKey, {
              toEmail: checkoutData.contact.email,
              firstName: checkoutData.contact.firstName,
              orderName: orderResult.name,
              items: checkoutData.cartLines.map((l) => ({
                title: l.title,
                quantity: l.quantity,
                price: l.price,
              })),
              total: checkoutData.total,
              currency: checkoutData.currency,
              paymentMethod: data.source?.payment_method,
              tapChargeId: tapId,
            }).catch((e) =>
              console.error('[Email] Failed to send confirmation:', e),
            );
          }
        } else if (orderResult?.error) {
          orderError = orderResult.error;
        }
      } else if (checkoutData?.shopifyOrderId) {
        shopifyOrderId = checkoutData.shopifyOrderId;
      }

      // Clear checkout session data
      clearCheckoutData(session);

      const sessionCookie = await session.commit();
      // Expire the Shopify cart cookie so the bag badge resets to 0
      const expireCartCookie =
        'cart=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax';

      return json(
        {
          status: 'success' as const,
          message:
            "Your order has been placed. We'll be in touch once it's on its way.",
          transactionId: data.id,
          receiptId: data.receipt?.id,
          amount: data.amount ? String(data.amount) : undefined,
          currency: data.currency,
          paymentMethod: data.source?.payment_method,
          merchantTxId: data.reference?.transaction ?? merchantTxId,
          orderName,
          shopifyOrderId,
          orderError,
          customerEmail: checkoutData?.contact?.email,
          nextPath: buildLocalePath('/collections/all', localePrefix),
          accountPath: buildLocalePath('/account', localePrefix),
        },
        {
          headers: [
            ['Set-Cookie', sessionCookie],
            ['Set-Cookie', expireCartCookie],
          ],
        },
      );
    }

    if (chargeStatus === 'INITIATED' || chargeStatus === 'IN_PROGRESS') {
      return json({
        status: 'pending' as const,
        message:
          'Your payment is being processed. We will notify you once confirmed.',
        transactionId: data.id,
        nextPath: buildLocalePath('/collections/all', localePrefix),
        retryPath: buildLocalePath('/checkout', localePrefix),
      });
    }

    // ABANDONED, CANCELLED, DECLINED, RESTRICTED, VOID, TIMEDOUT, UNKNOWN
    return json({
      status: 'failed' as const,
      message:
        data.response?.message ??
        'Payment was not successful. Please try again.',
      transactionId: data.id,
      nextPath: buildLocalePath('/collections/all', localePrefix),
      retryPath: buildLocalePath('/checkout', localePrefix),
    });
  } catch (err) {
    console.error('[Tap Callback] verification error:', err);
    return json({
      status: 'error' as const,
      message: 'Could not verify payment. Please contact support.',
      nextPath: buildLocalePath('/collections/all', localePrefix),
      retryPath: buildLocalePath('/checkout', localePrefix),
    });
  }
}

// ── UI ────────────────────────────────────────────────────────────────────────
export default function TapPaymentCallback() {
  const data = useLoaderData<typeof loader>();

  const cfg = {
    success: {
      icon: '✓',
      color: 'text-[#a87441]',
      bg: 'bg-[#a87441]/10',
      border: 'border-[#a87441]/20',
    },
    pending: {
      icon: '⏳',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
    },
    failed: {
      icon: '✕',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/20',
    },
    error: {
      icon: '!',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/20',
    },
  }[data.status] ?? {
    icon: '?',
    color: 'text-[#8B8076]',
    bg: 'bg-[#8B8076]/10',
    border: 'border-[#8B8076]/20',
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div
        initial={{opacity: 0, y: 20, scale: 0.95}}
        animate={{opacity: 1, y: 0, scale: 1}}
        transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        className="max-w-md w-full text-center"
      >
        <div
          className={`w-20 h-20 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center mx-auto mb-6`}
        >
          <span className={`text-3xl font-light ${cfg.color}`}>{cfg.icon}</span>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl text-brand-text mb-3">
          {data.status === 'success' && 'Order Placed'}
          {data.status === 'pending' && 'Processing Payment'}
          {(data.status === 'failed' || data.status === 'error') &&
            'Payment Unsuccessful'}
        </h1>

        <p className="text-[#8B8076] text-sm leading-relaxed mb-6">
          {data.message}
        </p>

        {data.status === 'success' && 'transactionId' in data && (
          <div
            className={`inline-block px-5 py-4 rounded-xl ${cfg.bg} border ${cfg.border} mb-6 text-left w-full`}
          >
            {'orderName' in data && data.orderName && (
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-widest text-[#8B8076]">
                  Order Number
                </p>
                <p className={`text-lg font-serif mt-0.5 ${cfg.color}`}>
                  {data.orderName as string}
                </p>
              </div>
            )}
            {'orderError' in data && data.orderError && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-[10px] uppercase tracking-widest text-red-400">
                  Shopify Order Error
                </p>
                <p className="text-xs text-red-300 mt-1 font-mono break-all">
                  {data.orderError as string}
                </p>
              </div>
            )}

            <p className="text-[10px] uppercase tracking-widest text-[#8B8076]">
              Transaction ID
            </p>
            <p className={`text-sm font-mono mt-0.5 ${cfg.color}`}>
              {data.transactionId}
            </p>

            {'paymentMethod' in data && data.paymentMethod && (
              <p className="text-[10px] uppercase tracking-widest text-[#8B8076] mt-3">
                Paid via {data.paymentMethod}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {(data.status === 'failed' || data.status === 'error') && (
            <Link
              to={
                'retryPath' in data && data.retryPath
                  ? data.retryPath
                  : '/checkout'
              }
              className="px-6 py-3 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#8B5E3C] transition-colors"
            >
              Try Again
            </Link>
          )}
          <Link
            to={
              'nextPath' in data && data.nextPath
                ? data.nextPath
                : '/collections/all'
            }
            className="px-6 py-3 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#8B5E3C] transition-colors"
          >
            Continue Shopping
          </Link>
          {data.status === 'success' && (
            <Link
              to={
                'accountPath' in data && data.accountPath
                  ? data.accountPath
                  : '/account'
              }
              className="px-6 py-3 bg-brand-text/10 text-brand-text text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-brand-text/20 transition-colors"
            >
              View Orders
            </Link>
          )}
        </div>

        {/* Guest: prompt to create account for order tracking */}
        {data.status === 'success' &&
          'customerEmail' in data &&
          data.customerEmail && (
            <div className="mt-8 p-4 rounded-xl border border-bronze/15 bg-bronze/5 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B8076] mb-1">
                Track Your Order
              </p>
              <p className="text-sm text-warm/80 mb-3">
                Create an account to view your order history and track your
                shipment.
              </p>
              <Link
                to={`/account/login`}
                className="inline-block px-5 py-2 border border-bronze/40 text-bronze text-[11px] uppercase tracking-[0.15em] rounded-sm hover:bg-bronze/10 transition-colors"
              >
                Create Account / Sign In →
              </Link>
            </div>
          )}
      </motion.div>
    </div>
  );
}
