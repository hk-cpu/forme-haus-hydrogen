import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
import {getSeoMeta, CacheLong, CacheShort} from '@shopify/hydrogen';
import {lazy, Suspense} from 'react';

import Hero from '~/components/Hero';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useLoaderData} from '@remix-run/react';

const CategoryBento = lazy(() => import('~/components/CategoryBento'));
const EditorialSection = lazy(() => import('~/components/EditorialSection'));
const JournalSection = lazy(() => import('~/components/JournalSection'));
const WhyChooseUs = lazy(() =>
  import('~/components/WhyChooseUs').then((module) => ({
    default: module.WhyChooseUs,
  })),
);
const TrustBadges = lazy(() =>
  import('~/components/TrustBadges').then((module) => ({
    default: module.TrustBadges,
  })),
);

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

function loadDeferredData({context}: LoaderFunctionArgs) {
  const theEditProducts = context.storefront
    .query(THE_EDIT_QUERY, {
      variables: {
        handle: 'the-edit',
        first: 4,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
      cache: CacheShort(),
    })
    .catch(() => null);

  return {theEditProducts};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

export default function Homepage() {
  const {theEditProducts} = useLoaderData<typeof loader>();

  return (
  <div className="min-h-screen bg-transparent text-warm">
      <Hero />

      <div id="explore-collections" className="relative z-20 mt-[-5vh] rounded-t-[2rem] bg-cream/85 text-brand-text shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.15)] backdrop-blur-md">
        <div className="pt-14 md:pt-16">
          <Suspense fallback={<SectionFallback className="min-h-[520px]" />}>
            <CategoryBento />
          </Suspense>
        </div>

        <div className="py-8 md:py-12">
          <Suspense fallback={<SectionFallback className="min-h-[640px]" />}>
            <EditorialSection theEditProducts={theEditProducts} />
          </Suspense>
        </div>

        <div className="section-deferred py-8 md:py-12">
          <Suspense fallback={<SectionFallback className="min-h-[420px]" />}>
            <JournalSection />
          </Suspense>
        </div>

        <div className="section-deferred">
          <Suspense fallback={<SectionFallback className="min-h-[420px]" />}>
            <WhyChooseUs />
          </Suspense>
        </div>

        <div className="section-deferred mx-auto max-w-[900px] px-6 py-6 md:px-8">
          <Suspense fallback={<SectionFallback className="min-h-[160px]" />}>
            <TrustBadges variant="full" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function SectionFallback({className}: {className: string}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(168,116,65,0.08),rgba(255,255,255,0.22))] ${className}`}
    />
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

const THE_EDIT_QUERY = `#graphql
  query TheEditCollection(
    $handle: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          images(first: 6) {
            nodes {
              url
              altText
              width
              height
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
` as const;
