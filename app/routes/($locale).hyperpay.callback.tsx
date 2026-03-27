/**
 * HyperPay Payment Callback Route
 * ────────────────────────────────
 * HyperPay redirects here after the customer completes (or cancels) payment.
 * This route verifies the transaction status with HyperPay's API server-side.
 *
 * URL pattern: /hyperpay/callback?id={checkoutId}&resourcePath=/v1/checkouts/{id}/payment
 *
 * HyperPay success/pending codes:
 *   000.000.000 — Transaction succeeded
 *   000.100.110 — Transaction pending (e.g. bank authorization pending)
 *   000.200.000 — Transaction pending (manual review)
 *
 * All other codes = failure.
 */

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';
import {motion} from 'framer-motion';

// Result code ranges per HyperPay docs
function isSuccess(code: string): boolean {
  return /^(000\.000\.|000\.100\.1|000\.[36]|000\.400\.[1][12]0)/.test(code);
}

function isPending(code: string): boolean {
  return /^(000\.200|000\.400\.0[^3]|000\.400\.100)/.test(code);
}

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const resourcePath = url.searchParams.get('resourcePath');

  const env = context.env as Record<string, string | undefined>;
  const accessToken = env.HYPERPAY_ACCESS_TOKEN;
  const baseUrl = env.HYPERPAY_BASE_URL ?? 'https://eu-test.oppwa.com';

  // Use the same entity ID that was used to create the checkout
  const brand = (url.searchParams.get('brand') ?? 'CARD').toUpperCase();
  const entityId =
    brand === 'MADA'
      ? env.HYPERPAY_ENTITY_ID_MADA ?? env.HYPERPAY_ENTITY_ID_CARD
      : brand === 'STC' || brand === 'STCPAY'
      ? env.HYPERPAY_ENTITY_ID_STCPAY ?? env.HYPERPAY_ENTITY_ID_CARD
      : env.HYPERPAY_ENTITY_ID_CARD;

  if (!resourcePath) {
    return json({status: 'error', message: 'No payment reference found.'});
  }

  if (!accessToken || !entityId) {
    return json({status: 'error', message: 'Payment gateway not configured.'});
  }

  try {
    const verifyUrl = new URL(`${baseUrl}${resourcePath}`);
    verifyUrl.searchParams.set('authentication.accessToken', accessToken);
    verifyUrl.searchParams.set('authentication.entityId', entityId);

    const response = await fetch(verifyUrl.toString());
    const data = (await response.json()) as {
      result?: {code: string; description: string};
      merchantTransactionId?: string;
      amount?: string;
      currency?: string;
      id?: string;
    };

    const code = data.result?.code ?? '';

    if (isSuccess(code)) {
      // TODO: Mark the Shopify order as paid / create order via Shopify API if needed
      return json({
        status: 'success',
        message: 'Payment successful. Thank you for your order!',
        transactionId: data.id,
        amount: data.amount,
        currency: data.currency,
        merchantTransactionId: data.merchantTransactionId,
      });
    }

    if (isPending(code)) {
      return json({
        status: 'pending',
        message:
          'Your payment is being processed. We will notify you once confirmed.',
        transactionId: data.id,
      });
    }

    return json({
      status: 'failed',
      message:
        data.result?.description ||
        'Payment was not successful. Please try again.',
    });
  } catch (err) {
    console.error('HyperPay callback verification error:', err);
    return json({
      status: 'error',
      message: 'Could not verify payment. Please contact support.',
    });
  }
}

// ─── Callback UI ──────────────────────────────────────────────────────────────
export default function HyperPayCallback() {
  const data = useLoaderData<typeof loader>();

  const config = {
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
        {/* Status Icon */}
        <div
          className={`w-20 h-20 rounded-full ${config.bg} border ${config.border} flex items-center justify-center mx-auto mb-6`}
        >
          <span className={`text-3xl font-light ${config.color}`}>
            {config.icon}
          </span>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl text-[#4A3C31] mb-3">
          {data.status === 'success' && 'Order Confirmed'}
          {data.status === 'pending' && 'Processing Payment'}
          {(data.status === 'failed' || data.status === 'error') &&
            'Payment Unsuccessful'}
        </h1>

        <p className="text-[#8B8076] text-sm leading-relaxed mb-8">
          {data.message}
        </p>

        {data.status === 'success' && (
          <div
            className={`inline-block px-4 py-2 rounded-lg ${config.bg} border ${config.border} mb-8`}
          >
            <p className="text-[10px] uppercase tracking-widest text-[#8B8076]">
              Transaction ID
            </p>
            <p className={`text-sm font-mono mt-0.5 ${config.color}`}>
              {data.transactionId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {(data.status === 'failed' || data.status === 'error') && (
            <Link
              to="/cart"
              className="px-6 py-3 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#8B5E3C] transition-colors"
            >
              Try Again
            </Link>
          )}
          <Link
            to={data.status === 'success' ? '/account' : '/collections/all'}
            className="px-6 py-3 bg-[#4A3C31]/10 text-[#4A3C31] text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#4A3C31]/20 transition-colors"
          >
            {data.status === 'success' ? 'View Orders' : 'Continue Shopping'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
