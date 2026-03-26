import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
import {getSeoMeta, CacheLong} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {useFetcher} from '@remix-run/react';

import Hero from '~/components/Hero';
import CategoryBento from '~/components/CategoryBento';
import EditorialSection from '~/components/EditorialSection';
import JournalSection from '~/components/JournalSection';
import {WhyChooseUs} from '~/components/WhyChooseUs';
import {TrustBadges} from '~/components/TrustBadges';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params, context} = args;
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    cache: CacheLong(),
  });

  return {
    shop,
    seo: seoPayload.home({url: request.url}),
  };
}

function loadDeferredData(_args: LoaderFunctionArgs) {
  return {};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

function NewsletterSection() {
  const fetcher = useFetcher<{success?: boolean; message?: string; error?: string}>();
  const isDone = fetcher.state === 'idle' && fetcher.data?.success;
  const isError = fetcher.state === 'idle' && fetcher.data?.error;

  return (
    <section className="py-14 md:py-20 border-t border-[#8B8076]/10">
      <div className="max-w-[520px] mx-auto px-6 text-center">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, ease: [0.16, 1, 3, 1]}}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider uppercase">
            JOIN THE HAUS
          </h2>
          <div className="flex flex-col items-center gap-1 mt-4 mb-8">
            <img
              src="/brand/logo-icon-only.webp"
              alt="Formé Haus"
              className="w-16 h-16 object-contain"
            />
            <span className="font-serif text-base md:text-lg italic text-[#736659] font-light tracking-wide">
              Where Essence Meets Elegance
            </span>
          </div>
          <p className="text-sm text-[#736659] mb-6 font-light">
            Be the first to know about new arrivals, exclusive edits, and stories from the Haus.
          </p>

          {isDone ? (
            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              className="py-4 px-6 bg-[#a87441]/10 rounded-sm border border-[#a87441]/20"
            >
              <p className="text-[#a87441] text-sm font-medium">
                {fetcher.data?.message ?? 'Thank you for subscribing.'}
              </p>
            </motion.div>
          ) : (
            <fetcher.Form
              method="post"
              action="/api/newsletter"
              className="flex flex-col sm:flex-row gap-3 items-stretch"
            >
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-transparent border border-[#8B8076]/25 rounded-sm text-sm text-[#4A3C31] placeholder:text-[#736659]/50 focus:outline-none focus:border-[#a87441]/50 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={fetcher.state !== 'idle'}
                className="px-6 py-3 bg-[#4A3C31] text-[#F0EAE6] text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-[#a87441] transition-colors duration-300 whitespace-nowrap disabled:opacity-60"
              >
                {fetcher.state !== 'idle' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </fetcher.Form>
          )}

          {isError && (
            <p className="text-red-400 text-xs mt-2">{fetcher.data?.error}</p>
          )}

          <p className="text-[10px] text-[#736659]/60 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function Homepage() {
  const {t} = useTranslation();

  return (
    <div className="min-h-screen bg-transparent text-[#F0EAE6]">
      {/* 1. Hero */}
      <Hero />

      {/* Light "Glowing" Theme Content Sheet */}
      <div className="relative z-20 bg-[#F9F5F0]/85 backdrop-blur-md text-[#4A3C31] rounded-t-[2rem] shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.15)] mt-[-5vh]">
        {/* 2. Category Slider */}
        <div className="pt-14 md:pt-16">
          <CategoryBento />
        </div>

        {/* 3. The Edit (Editorial Section) */}
        <div className="py-8 md:py-12">
          <EditorialSection />
        </div>

        {/* 4. The Journal */}
        <div className="py-8 md:py-12">
          <JournalSection />
        </div>

        {/* 5. Why Choose Us */}
        <div>
          <WhyChooseUs />
        </div>

        {/* 5b. Trust Badges — Maroof, Muwathooq, Secure Payment */}
        <div className="py-6 px-6 md:px-8 max-w-[900px] mx-auto">
          <TrustBadges variant="full" />
        </div>

        {/* 6. JOIN THE HAUS — Newsletter */}
        <NewsletterSection />
      </div>
    </div>
  );
}

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
  }
` as const;
