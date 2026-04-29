import {useState} from 'react';
import {useFetcher} from '@remix-run/react';
import {motion} from 'framer-motion';
import clsx from 'clsx';

import {useTranslation} from '~/hooks/useTranslation';

type BuyNowFetcherData = {
  checkoutUrl?: string;
  error?: string;
};

export function BuyNowButton({
  variantId,
  quantity = 1,
  disabled = false,
  className = '',
}: {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
}) {
  const fetcher = useFetcher<BuyNowFetcherData>();
  const {t} = useTranslation();
  const [redirectError, setRedirectError] = useState<string | null>(null);

  const isLoading = fetcher.state !== 'idle';
  const serverError = fetcher.data?.error;
  const checkoutUrl = fetcher.data?.checkoutUrl;

  // Redirect to Shopify hosted checkout as soon as URL arrives
  if (checkoutUrl && typeof window !== 'undefined') {
    document.body.style.overflow = '';
    window.location.href = checkoutUrl;
  }

  const error = redirectError ?? serverError;

  return (
    <div className="flex flex-col gap-2">
      <fetcher.Form method="post" action="/buy-now">
        <input type="hidden" name="variantId" value={variantId} />
        <input type="hidden" name="quantity" value={quantity} />
        <motion.button
          type="submit"
          disabled={disabled || isLoading || !!checkoutUrl}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-4 transition-all duration-300 tracking-widest uppercase text-sm font-medium',
            'bg-[#a87441] hover:bg-[#8B6535] text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          whileHover={!disabled && !isLoading ? {scale: 1.01} : {}}
          whileTap={!disabled && !isLoading ? {scale: 0.99} : {}}
        >
          {isLoading || checkoutUrl ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              {t('product.buyNowLoading', 'Processing…')}
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('product.buyNow', 'Buy Now')}
            </>
          )}
        </motion.button>
      </fetcher.Form>

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
