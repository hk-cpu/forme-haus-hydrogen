/**
 * Tap Payments Callback Route
 * ────────────────────────────
 * Tap redirects here after customer completes/cancels payment.
 * On CAPTURED: creates a real Shopify order via Admin API and shows confirmation.
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
      customer: {
        email: data.contact.email,
        first_name: data.contact.firstName,
        last_name: data.contact.lastName,
        phone: data.contact.phone,
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
      send_receipt: true,
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
      },
    );
    const body = (await res.json()) as {
      order?: {id: number; name: string};
      errors?: unknown;
    };
    if (body.order) {
      return {id: String(body.order.id), name: body.order.name};
    }
    console.error('[Tap Callback] Shopify order creation failed:', body.errors);
    return {error: 'Order creation failed'};
  } catch (err) {
    console.error('[Tap Callback] Shopify order API error:', err);
    return {error: 'Order creation error'};
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
  const adminToken = env.SHOPIFY_ADMIN_API_TOKEN;
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

    const chargeStatus = data.status?.toUpperCase();

    if (chargeStatus === 'CAPTURED') {
      // Retrieve checkout session data
      const checkoutData = getCheckoutData(session);
      let orderName: string | undefined;
      let shopifyOrderId: string | undefined;

      // Create Shopify order if we have Admin API token and haven't done it yet
      if (adminToken && checkoutData && !checkoutData.orderCreated) {
        const orderResult = await createShopifyOrder(storeDomain, adminToken, {
          contact: checkoutData.contact,
          address: checkoutData.address,
          cartLines: checkoutData.cartLines,
          total: checkoutData.total,
          currency: checkoutData.currency,
          merchantTxId: checkoutData.merchantTxId,
          tapChargeId: tapId,
          paymentMethod: data.source?.payment_method,
        });

        if (orderResult.name) {
          orderName = orderResult.name;
          shopifyOrderId = orderResult.id;
          markOrderCreated(session, orderResult.id ?? '');
        }
      } else if (checkoutData?.shopifyOrderId) {
        shopifyOrderId = checkoutData.shopifyOrderId;
      }

      // Clear checkout session
      clearCheckoutData(session);

      return json({
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
        nextPath: buildLocalePath('/account', localePrefix),
      });
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
          {data.status === 'success' && 'Order Confirmed'}
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
                : data.status === 'success'
                ? '/account'
                : '/collections/all'
            }
            className="px-6 py-3 bg-brand-text/10 text-brand-text text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-brand-text/20 transition-colors"
          >
            {data.status === 'success' ? 'View Orders' : 'Continue Shopping'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
