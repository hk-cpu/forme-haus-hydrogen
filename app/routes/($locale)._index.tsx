import {useLoaderData} from '@remix-run/react';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
import {getSeoMeta, CacheLong} from '@shopify/hydrogen';
import {lazy, Suspense} from 'react';

import Hero from '~/components/Hero';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const CategoryBento = lazy(() => import('~/components/CategoryBento'));
const EditorialSection = lazy(() => import('~/components/EditorialSection'));
const JournalSection = lazy(() => import('~/components/JournalSection'));
const WhyChooseUs = lazy(() =>
  import('~/components/WhyChooseUs').then((module) => ({
    default: module.WhyChooseUs,
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
  const {shop, metaobjects} = await context.storefront.query(HOMEPAGE_QUERY, {
    cache: CacheLong(),
  });

  const bentoItems =
    metaobjects?.nodes
      ?.map((node: any) => {
        const fields = node.fields.reduce((acc: any, field: any) => {
          acc[field.key] = field;
          return acc;
        }, {});

        return {
          image: fields.image?.reference?.image?.url,
          width: fields.image?.reference?.image?.width || 1024,
          height: fields.image?.reference?.image?.height || 1024,
          alt:
            fields.alt?.value ||
            fields.image?.reference?.image?.altText ||
            fields.title_en?.value ||
            '',
          url: fields.url?.value || '#',
          defaultTitle: fields.title_en?.value || '',
          defaultSubtitle: fields.subtitle_en?.value || '',
          titleKey: '', // Ignored when using dynamic data
          subtitleKey: '',
        };
      })
      .filter((item: any) => item.image) || [];

  return {
    shop,
    seo: seoPayload.home({url: request.url}),
    bentoItems: bentoItems.length > 0 ? bentoItems : undefined,
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
  const {bentoItems} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-transparent text-warm">
      <Hero />

      <div
        id="explore-collections"
        className="relative z-20 mt-[-5vh] rounded-t-[2rem] bg-cream/85 text-brand-text shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.15)] backdrop-blur-md"
      >
        <div className="pt-14 md:pt-16">
          <Suspense fallback={<SectionFallback className="min-h-[520px]" />}>
            <CategoryBento />
          </Suspense>
        </div>

        <div className="py-8 md:py-12">
          <Suspense fallback={<SectionFallback className="min-h-[640px]" />}>
            <EditorialSection bentoItems={bentoItems as any} />
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

const HOMEPAGE_QUERY = `#graphql
  query seoCollectionContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
    metaobjects(type: "bento_item", first: 4) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                width
                height
                altText
              }
            }
          }
        }
      }
    }
  }
` as const;
