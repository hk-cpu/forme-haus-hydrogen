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
        signal: AbortSignal.timeout(5000)
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
      console.error('[Tap Callback] Shopify order creation failed:', body.errors);
      return {error: typeof body.errors === 'string' ? body.errors : JSON.stringify(body.errors)};
    }
    return {error: 'Order creation failed'};
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      console.warn('[Tap Callback] Shopify order creation timed out, letting webhook handle it.');
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
  chargeStatus: string
): Promise<{id?: string; name?: string; error?: string}> {
  try {
    // First, check if the draft order is already completed
    const getRes = await fetch(
      `https://${storeDomain}/admin/api/2024-10/draft_orders/${draftOrderId}.json`,
      { 
        headers: { 'X-Shopify-Access-Token': adminToken },
        signal: AbortSignal.timeout(4000)
      }
    );
    const getData = await getRes.json() as any;
    
    if (getData.draft_order?.order_id) {
       const orderId = getData.draft_order.order_id;
       const orderRes = await fetch(
         `https://${storeDomain}/admin/api/2024-10/orders/${orderId}.json`,
         { 
           headers: { 'X-Shopify-Access-Token': adminToken },
           signal: AbortSignal.timeout(4000)
         }
       );
       const orderData = await orderRes.json() as any;
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
        signal: AbortSignal.timeout(4500)
      }
    );
    const completeData = await completeRes.json() as any;
    if (completeData.draft_order?.order_id) {
      const orderId = completeData.draft_order.order_id;
      
      const orderRes = await fetch(
        `https://${storeDomain}/admin/api/2024-10/orders/${orderId}.json`,
        {
          headers: { 'X-Shopify-Access-Token': adminToken },
          signal: AbortSignal.timeout(4000)
        }
      );
      const orderData = await orderRes.json() as any;
      console.log(`[Tap Callback] Shopify draft order completed: ${orderData.order?.name} (${orderId})`);
      return {id: String(orderId), name: orderData.order?.name};
    }
    return {error: JSON.stringify(completeData.errors)};
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      console.warn(`[Tap Callback] Shopify API timed out for Draft Order ${draftOrderId}. Let webhook complete it.`);
      return {}; // Gracefully return without error, UI will show generic success
    }
    console.error('[Tap Callback] Draft completion error:', err);
    return {error: err instanceof Error ? err.message : 'Draft completion error'};
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
  const adminToken = env.SHOPIFY_ADMIN_API_TOKEN || env.PRIVATE_STOREFRONT_API_TOKEN;
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
      const actualMerchantTxId = data.reference?.transaction ?? merchantTxId ?? checkoutData?.merchantTxId;

      if (adminToken && storeDomain && actualMerchantTxId) {
        let orderResult;

        if (actualMerchantTxId.startsWith('DO-')) {
          const draftOrderId = actualMerchantTxId.replace('DO-', '');
          orderResult = await completeDraftOrder(storeDomain, adminToken, draftOrderId, tapId, chargeStatus);
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
          if (resendKey && checkoutData.contact.email) {
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
          message: 'Payment successful. Thank you for your order!',
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

  const isSuccess = data.status === 'success';
  const isPending = data.status === 'pending';
  const isFailed = data.status === 'failed' || data.status === 'error';

  const cfg = {
    success: {
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'text-bronze',
      bg: 'bg-bronze/5',
      border: 'border-bronze/20',
      glow: 'shadow-[0_0_30px_rgba(168,116,65,0.15)]',
      title: 'Order Confirmed',
    },
    pending: {
      icon: (
        <svg className="w-10 h-10 animate-[spin_3s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-warm',
      bg: 'bg-taupe/5',
      border: 'border-taupe/20',
      glow: 'shadow-[0_0_30px_rgba(255,255,255,0.05)]',
      title: 'Processing Payment',
    },
    failed: {
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-red-400',
      bg: 'bg-red-400/5',
      border: 'border-red-400/20',
      glow: 'shadow-[0_0_30px_rgba(248,113,113,0.1)]',
      title: 'Payment Unsuccessful',
    },
  }[isSuccess ? 'success' : isPending ? 'pending' : 'failed'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="min-h-[85vh] bg-background flex flex-col items-center justify-center px-4 py-20 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 ${cfg.bg} mix-blend-screen`} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-lg z-10 relative"
      >
        {/* Receipt Card */}
        <motion.div variants={itemVariants} className={`bg-surface/40 backdrop-blur-xl border ${cfg.border} rounded-2xl overflow-hidden ${cfg.glow}`}>
          
          {/* Header Section */}
          <div className="px-8 py-10 flex flex-col items-center text-center border-b border-taupe/10">
            <div className={`w-20 h-20 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center mb-6 ${cfg.color}`}>
              {cfg.icon}
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl text-warm mb-3">
              {cfg.title}
            </h1>
            
            <p className="text-taupe text-sm leading-relaxed max-w-xs mx-auto">
              {data.message}
            </p>
          </div>

          {/* Details Section */}
          {(isSuccess && 'transactionId' in data) && (
            <div className="px-8 py-8 bg-surface/20">
              <div className="space-y-6">
                {'orderName' in data && data.orderName && (
                  <div className="flex justify-between items-baseline border-b border-taupe/5 pb-6">
                    <span className="text-[10px] uppercase tracking-widest text-taupe">Order No.</span>
                    <span className={`text-lg font-serif ${cfg.color}`}>{data.orderName as string}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline border-b border-taupe/5 pb-6">
                  <span className="text-[10px] uppercase tracking-widest text-taupe">Transaction ID</span>
                  <span className="text-xs font-mono text-warm">{data.transactionId}</span>
                </div>

                {'amount' in data && data.amount && 'currency' in data && (
                  <div className="flex justify-between items-baseline border-b border-taupe/5 pb-6">
                    <span className="text-[10px] uppercase tracking-widest text-taupe">Total Paid</span>
                    <span className="text-sm text-warm">
                      {new Intl.NumberFormat('en-SA', { style: 'currency', currency: data.currency as string }).format(parseFloat(data.amount as string))}
                    </span>
                  </div>
                )}

                {'paymentMethod' in data && data.paymentMethod && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] uppercase tracking-widest text-taupe">Payment Method</span>
                    <span className="text-xs text-warm capitalize">{data.paymentMethod as string}</span>
                  </div>
                )}
                
                {'orderError' in data && data.orderError && (
                  <div className="mt-6 p-4 bg-red-400/5 border border-red-400/20 rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-red-400 mb-2">Notice</p>
                    <p className="text-xs text-red-300 font-mono break-all leading-relaxed">
                      {data.orderError as string}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3">
          {isFailed && (
             <Link
               to={'retryPath' in data && data.retryPath ? data.retryPath : '/checkout'}
               className="w-full py-4 bg-bronze hover:bg-bronze/90 text-white text-center text-[11px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_4px_14px_rgba(168,116,65,0.25)] hover:shadow-[0_6px_20px_rgba(168,116,65,0.4)]"
             >
               Try Again
             </Link>
          )}

          {isSuccess && (
            <Link
              to={'accountPath' in data && data.accountPath ? data.accountPath : '/account'}
              className="w-full py-4 bg-bronze hover:bg-bronze/90 text-white text-center text-[11px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_4px_14px_rgba(168,116,65,0.25)] hover:shadow-[0_6px_20px_rgba(168,116,65,0.4)]"
            >
              View Orders
            </Link>
          )}
          
          <Link
            to={'nextPath' in data && data.nextPath ? data.nextPath : '/collections/all'}
            className="w-full py-4 bg-transparent border border-taupe/20 hover:border-bronze text-warm hover:text-bronze text-center text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Guest Invite */}
        {isSuccess && 'customerEmail' in data && data.customerEmail && (
          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-taupe/10 text-center">
            <h3 className="font-serif text-lg text-warm mb-2">Track Your Journey</h3>
            <p className="text-sm text-taupe mb-6 max-w-sm mx-auto">
              Create an exclusive Formé Haus account to track shipments and access your luxury order history.
            </p>
            <Link
              to={`/account/login`}
              className="inline-block border-b border-bronze/50 pb-1 text-bronze hover:text-bronze/80 hover:border-bronze/80 text-[11px] uppercase tracking-[0.15em] transition-colors"
            >
              Create Account / Sign In
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
