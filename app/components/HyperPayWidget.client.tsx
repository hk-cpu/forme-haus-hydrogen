/**
 * HyperPayWidget.client.tsx
 * ──────────────────────────
 * Client-only component that renders the HyperPay payment form.
 * Must be imported with lazy() + Suspense to avoid SSR issues.
 *
 * Usage in Cart.tsx (or a checkout page):
 *
 *   import {lazy, Suspense} from 'react';
 *   const HyperPayWidget = lazy(() => import('~/components/HyperPayWidget.client'));
 *
 *   <Suspense fallback={<div>Loading payment form…</div>}>
 *     <HyperPayWidget
 *       checkoutId={checkoutId}
 *       baseUrl={baseUrl}
 *       brands="MADA VISA MASTER"
 *       callbackPath="/hyperpay/callback"
 *     />
 *   </Suspense>
 */

import {useEffect, useRef, useState} from 'react';

interface HyperPayWidgetProps {
  /** The checkoutId returned from /hyperpay/initiate */
  checkoutId: string;
  /** HyperPay base URL (test or prod) */
  baseUrl: string;
  /** Space-separated payment brands e.g. "MADA VISA MASTER AMEX" */
  brands?: string;
  /** Path HyperPay redirects to after payment */
  callbackPath?: string;
}

export default function HyperPayWidget({
  checkoutId,
  baseUrl,
  brands = 'MADA VISA MASTER AMEX',
  callbackPath = '/hyperpay/callback',
}: HyperPayWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutId || !containerRef.current) return;

    // Build the absolute callback URL
    const callbackUrl = `${window.location.origin}${callbackPath}`;

    // Inject the HyperPay script
    const scriptSrc = `${baseUrl}/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);

    if (!existing) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => setLoaded(true);
      script.onerror = () =>
        setError(
          'Failed to load payment widget. Please refresh and try again.',
        );
      document.head.appendChild(script);
    } else {
      setLoaded(true);
    }

    // Store the callback URL so the form action is correct
    const form = containerRef.current.querySelector('form.paymentWidgets');
    if (form) {
      (form as HTMLFormElement).action = callbackUrl;
    }
  }, [checkoutId, baseUrl, callbackPath]);

  if (error) {
    return (
      <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm text-center">
        {error}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="hyperpay-widget-wrapper">
      {/* HyperPay injects its iframe into this form */}
      <form
        className="paymentWidgets"
        data-brands={brands}
        // Absolute URL required by HyperPay
        action={`${
          typeof window !== 'undefined' ? window.location.origin : ''
        }${callbackPath}`}
      />

      {!loaded && (
        <div className="flex items-center justify-center gap-3 py-8 text-[#8B8076] text-sm">
          <div className="w-5 h-5 rounded-full border-2 border-[#a87441]/30 border-t-[#a87441] animate-spin" />
          Loading payment form…
        </div>
      )}

      {/* HyperPay widget CSS overrides for dark theme */}
      <style>{`
        .wpwl-container {
          font-family: inherit !important;
        }
        .wpwl-form {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }
        .wpwl-button-pay {
          background: linear-gradient(to right, #a87441, #8B5E3C) !important;
          border: none !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          letter-spacing: 0.2em !important;
          text-transform: uppercase !important;
          padding: 14px 24px !important;
          width: 100% !important;
        }
        .wpwl-button-pay:hover {
          background: linear-gradient(to right, #8B5E3C, #a87441) !important;
        }
        .wpwl-brand-card {
          margin: 8px 4px !important;
        }
      `}</style>
    </div>
  );
}
