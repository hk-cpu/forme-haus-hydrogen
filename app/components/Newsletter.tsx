
import { useFetcher } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { useTranslation } from '~/hooks/useTranslation';

export function Newsletter() {
    const fetcher = useFetcher<{ success?: boolean; error?: string; message?: string }>();
    const formRef = useRef<HTMLFormElement>(null);
    const { t } = useTranslation() as any;

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
            <fetcher.Form
                method="post"
                action="/api/newsletter"
                ref={formRef}
                className="relative"
            >
                <div className="relative flex items-center border-b border-[#a87441]/30 hover:border-[#a87441] transition-colors pb-1">
                    <input
                        type="email"
                        name="email"
                        placeholder={t('footer.emailPlaceholder', { defaultValue: 'Enter your email' } as any)}
                        className="w-full bg-transparent text-[#F0EAE6] text-sm placeholder:text-[#AA9B8F]/50 focus:outline-none py-2 tracking-wide font-light"
                        required
                    />
                    <button
                        type="submit"
                        disabled={fetcher.state === 'submitting'}
                        className="text-[#a87441] text-xs uppercase tracking-widest hover:text-[#F0EAE6] transition-colors disabled:opacity-50 ml-2"
                    >
                        {fetcher.state === 'submitting' ? (t('footer.submitting', { defaultValue: 'Sending...' } as any)) : (t('footer.subscribe', { defaultValue: 'Join' } as any))}
                    </button>
                </div>

                {message && (
                    <p className={`absolute top-full left-0 mt-2 text-xs tracking-wider ${isError ? 'text-red-400' : 'text-[#a87441]'}`}>
                        {message}
                    </p>
                )}
            </fetcher.Form>
        </div>
    );
}
