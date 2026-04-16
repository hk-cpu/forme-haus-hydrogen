/**
 * Tap Payments Callback Route
 * ────────────────────────────
 * Tap redirects here after the customer completes or cancels payment.
 * Verifies charge status with Tap's API server-side.
 *
 * URL: /tap/callback?tap_id={chargeId}
 */

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {buildLocalePath, getPathLocalePrefix} from '~/lib/utils';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tapId = url.searchParams.get('tap_id');
  const merchantTxId = url.searchParams.get('merchantTxId') || '';
  const localePrefix = getPathLocalePrefix(url.pathname);

  const {env} = context;
  const secretKey = env.TAP_SECRET_KEY;
  const apiUrl = env.TAP_API_URL || 'https://api.tap.company/v2';

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
    // Retrieve the charge from Tap to verify status
    const response = await fetch(`${apiUrl}/charges/${tapId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: 'application/json',
      },
    });

    const data = (await response.json()) as {
      id?: string;
      status?: string;
      amount?: number;
      currency?: string;
      receipt?: {id?: string};
      reference?: {transaction?: string; order?: string};
      source?: {payment_method?: string; payment_type?: string};
      response?: {code?: string; message?: string};
    };

    const chargeStatus = data.status?.toUpperCase();

    if (chargeStatus === 'CAPTURED') {
      // Payment successful
      // Payment captured — order creation handled by Shopify checkout integration
      return json({
        status: 'success' as const,
        message: 'Payment successful. Thank you for your order!',
        transactionId: data.id,
        receiptId: data.receipt?.id,
        amount: data.amount ? String(data.amount) : undefined,
        currency: data.currency,
        paymentMethod: data.source?.payment_method,
        merchantTxId: data.reference?.transaction || merchantTxId,
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
        retryPath: buildLocalePath('/cart', localePrefix),
      });
    }

    // ABANDONED, CANCELLED, DECLINED, RESTRICTED, VOID, TIMEDOUT, UNKNOWN
    return json({
      status: 'failed' as const,
      message:
        data.response?.message ||
        'Payment was not successful. Please try again.',
      transactionId: data.id,
      nextPath: buildLocalePath('/collections/all', localePrefix),
      retryPath: buildLocalePath('/cart', localePrefix),
    });
  } catch (err) {
    console.error('Tap callback verification error:', err);
    return json({
      status: 'error' as const,
      message: 'Could not verify payment. Please contact support.',
      nextPath: buildLocalePath('/collections/all', localePrefix),
      retryPath: buildLocalePath('/cart', localePrefix),
    });
  }
}

// ─── Callback UI ──────────────────────────────────────────────────────────────
export default function TapPaymentCallback() {
  const data = useLoaderData<typeof loader>();

  const config = {
    success: {
      icon: '\u2713',
      color: 'text-[#a87441]',
      bg: 'bg-[#a87441]/10',
      border: 'border-[#a87441]/20',
    },
    pending: {
      icon: '\u23F3',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
    },
    failed: {
      icon: '\u2715',
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
        {/* Status Icon */}
        <div
          className={`w-20 h-20 rounded-full ${config.bg} border ${config.border} flex items-center justify-center mx-auto mb-6`}
        >
          <span className={`text-3xl font-light ${config.color}`}>
            {config.icon}
          </span>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl text-brand-text mb-3">
          {data.status === 'success' && 'Order Confirmed'}
          {data.status === 'pending' && 'Processing Payment'}
          {(data.status === 'failed' || data.status === 'error') &&
            'Payment Unsuccessful'}
        </h1>

        <p className="text-[#8B8076] text-sm leading-relaxed mb-8">
          {data.message}
        </p>

        {data.status === 'success' && 'transactionId' in data && (
          <div
            className={`inline-block px-4 py-2 rounded-lg ${config.bg} border ${config.border} mb-8`}
          >
            <p className="text-[10px] uppercase tracking-widest text-[#8B8076]">
              Transaction ID
            </p>
            <p className={`text-sm font-mono mt-0.5 ${config.color}`}>
              {data.transactionId}
            </p>
            {'paymentMethod' in data && data.paymentMethod && (
              <p className="text-[10px] uppercase tracking-widest text-[#8B8076] mt-2">
                Paid via {data.paymentMethod}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {(data.status === 'failed' || data.status === 'error') && (
            <Link
              to={
                'retryPath' in data && data.retryPath ? data.retryPath : '/cart'
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
