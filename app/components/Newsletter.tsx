import {useFetcher} from '@remix-run/react';
import {useEffect, useRef} from 'react';

import {useTranslation} from '~/hooks/useTranslation';

export function Newsletter() {
  const fetcher = useFetcher<{
    success?: boolean;
    error?: string;
    message?: string;
  }>();
  const formRef = useRef<HTMLFormElement>(null);
  const {t} = useTranslation() as any;

  const isSuccess = fetcher.data?.success;
  const isError = fetcher.data?.error;
  const message = fetcher.data?.message || fetcher.data?.error;

  useEffect(() => {
    if (isSuccess && formRef.current) {
      formRef.current.reset();
    }
  }, [isSuccess]);

  return (
    <div className="w-full">
      {isSuccess ? (
        <div className="bg-[#1a1410] border border-[#D4AF87]/30 rounded-sm px-6 py-5 text-center">
          <p className="font-serif italic text-[#D4AF87] flex items-center justify-center gap-2 text-lg">
            <span className="sparkle-anim text-[10px] inline-block">✨</span>
            Welcome to the Haus
            <span
              className="sparkle-anim text-[10px] inline-block"
              style={{animationDelay: '0.5s'}}
            >
              ✨
            </span>
          </p>
        </div>
      ) : (
        <fetcher.Form
          method="post"
          action="/api/newsletter"
          ref={formRef}
          className="relative"
        >
          <div className="relative flex items-center border-b border-bronze/30 hover:border-bronze focus-within:border-bronze focus-within:shadow-[0_0_30px_rgba(168,116,65,0.3),0_2px_10px_rgba(168,116,65,0.2)] transition-all duration-500 pb-1 group">
            <input
              type="email"
              name="email"
              id="newsletter-email"
              autoComplete="email"
              placeholder={t('footer.emailPlaceholder', {
                defaultValue: 'Enter your email',
              } as any)}
              className="w-full bg-transparent text-[#F0EAE6] text-sm placeholder:text-[#AA9B8F]/50 focus:outline-none py-2 tracking-wide font-light transition-all duration-300 focus:tracking-wider newsletter-input"
              required
            />
            <button
              type="submit"
              disabled={fetcher.state === 'submitting'}
              className="text-bronze text-xs uppercase tracking-widest hover:text-[#F0EAE6] hover:tracking-[0.2em] transition-all duration-300 disabled:opacity-50 ml-2 focus:outline-none focus-visible:text-[#F0EAE6] min-h-[44px] min-w-[44px] flex items-center justify-center px-2"
            >
              {fetcher.state === 'submitting'
                ? t('footer.submitting', {defaultValue: 'Sending...'} as any)
                : t('footer.subscribe', {defaultValue: 'Join'} as any)}
            </button>
          </div>

          {message && (
            <p
              className={`absolute top-full left-0 mt-2 text-xs tracking-wider ${
                isError ? 'text-red-400' : 'text-bronze'
              }`}
            >
              {message}
            </p>
          )}
        </fetcher.Form>
      )}
    </div>
  );
}
