import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
import {getSeoMeta, CacheLong} from '@shopify/hydrogen';

import Hero from '~/components/Hero';
import CategoryBento from '~/components/CategoryBento';
import EditorialSection from '~/components/EditorialSection';
import JournalSection from '~/components/JournalSection';
import {WhyChooseUs} from '~/components/WhyChooseUs';
import {TrustBadges} from '~/components/TrustBadges';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

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

export default function Homepage() {
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

        {/* 4. The Journal — below fold: render-skip until near viewport */}
        <div className="py-8 md:py-12 section-deferred">
          <JournalSection />
        </div>

        {/* 5. Why Choose Us — below fold */}
        <div className="section-deferred">
          <WhyChooseUs />
        </div>

        {/* 5b. Trust Badges — Maroof, Muwathooq, Secure Payment */}
        <div className="py-6 px-6 md:px-8 max-w-[900px] mx-auto section-deferred">
          <TrustBadges variant="full" />
        </div>
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
