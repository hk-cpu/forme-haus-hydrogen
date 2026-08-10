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
const TrustBadges = lazy(() => import('~/components/TrustBadges'));

export const headers = routeHeaders;

/**
 * Translation keys for the four original editorial tiles, looked up by
 * metaobject handle.
 *
 * These are a fallback only: a bento entry's own `title_ar`/`subtitle_ar`
 * always wins. They exist so entries created before those fields were added
 * keep rendering Arabic instead of falling back to English. Once every entry
 * carries its own Arabic text, this map and the `titleKey`/`subtitleKey`
 * plumbing can be deleted.
 */
const LEGACY_BENTO_KEYS: Record<string, {title: string; subtitle: string}> = {
  'modern-essentials': {
    title: 'editorial.modernEssentials.title',
    subtitle: 'editorial.modernEssentials.subtitle',
  },
  'carry-it-your-way': {
    title: 'editorial.carry.title',
    subtitle: 'editorial.carry.subtitle',
  },
  'sun-ready': {
    title: 'editorial.sun.title',
    subtitle: 'editorial.sun.subtitle',
  },
  'new-arrivals': {
    title: 'editorial.new.title',
    subtitle: 'editorial.new.subtitle',
  },
};

/** Turns a metaobject's `fields` array into a `{[key]: field}` lookup. */
function toFieldMap(node: any): Record<string, any> {
  return node.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field;
    return acc;
  }, {});
}

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
  const {
    shop,
    bentoMetaobjects,
    categoryMetaobjects,
    journalMetaobjects,
    promiseMetaobjects,
  } = await context.storefront.query(HOMEPAGE_QUERY, {
    cache: CacheLong(),
  });

  const bentoItems =
    bentoMetaobjects?.nodes
      ?.map((node: any) => {
        const fields = node.fields.reduce((acc: any, field: any) => {
          acc[field.key] = field;
          return acc;
        }, {});

        const legacy = LEGACY_BENTO_KEYS[node.handle] ?? {
          title: '',
          subtitle: '',
        };

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
          titleEn: fields.title_en?.value || '',
          titleAr: fields.title_ar?.value || '',
          subtitleEn: fields.subtitle_en?.value || '',
          subtitleAr: fields.subtitle_ar?.value || '',
          defaultTitle: fields.title_en?.value || '',
          defaultSubtitle: fields.subtitle_en?.value || '',
          titleKey: legacy.title,
          subtitleKey: legacy.subtitle,
        };
      })
      .filter((item: any) => item.image) || [];

  const categoryCards =
    categoryMetaobjects?.nodes
      ?.map((node: any) => {
        const fields = node.fields.reduce((acc: any, field: any) => {
          acc[field.key] = field;
          return acc;
        }, {});
        const img = fields.image?.reference?.image;
        if (!img?.url) return null;
        return {
          image: img.url,
          width: img.width || 640,
          height: img.height || 1160,
          titleEn: fields.title_en?.value || '',
          titleAr: fields.title_ar?.value || '',
          url: fields.url?.value || '#',
          sortOrder: Number(fields.sort_order?.value ?? 99),
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];

  const journalCards =
    journalMetaobjects?.nodes
      ?.map((node: any) => {
        const fields = toFieldMap(node);
        const img = fields.image?.reference?.image;
        if (!img?.url) return null;
        return {
          image: img.url,
          width: img.width || 640,
          height: img.height || 800,
          alt: fields.alt?.value || img.altText || '',
          url: fields.url?.value || '#',
          title: fields.title_en?.value || '',
          excerpt: fields.excerpt_en?.value || '',
          titleEn: fields.title_en?.value || '',
          titleAr: fields.title_ar?.value || '',
          excerptEn: fields.excerpt_en?.value || '',
          excerptAr: fields.excerpt_ar?.value || '',
          sortOrder: Number(fields.sort_order?.value ?? 99),
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];

  const brandPromises =
    promiseMetaobjects?.nodes
      ?.map((node: any) => {
        const fields = toFieldMap(node);
        const title = fields.title_en?.value || '';
        if (!title) return null;
        return {
          id: node.id,
          iconKey: fields.icon?.value || 'shield',
          title,
          description: fields.description_en?.value || '',
          titleEn: title,
          titleAr: fields.title_ar?.value || '',
          descriptionEn: fields.description_en?.value || '',
          descriptionAr: fields.description_ar?.value || '',
          sortOrder: Number(fields.sort_order?.value ?? 99),
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];

  const heroCta = {
    en: shop.heroCtaEn?.value || '',
    ar: shop.heroCtaAr?.value || '',
  };

  return {
    shop,
    seo: seoPayload.home({url: request.url}),
    bentoItems: bentoItems.length > 0 ? bentoItems : undefined,
    categoryCards: categoryCards.length > 0 ? categoryCards : undefined,
    journalCards: journalCards.length > 0 ? journalCards : undefined,
    brandPromises: brandPromises.length > 0 ? brandPromises : undefined,
    heroCta: heroCta.en || heroCta.ar ? heroCta : undefined,
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
  const {bentoItems, categoryCards, heroCta, journalCards, brandPromises} =
    useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-transparent text-warm">
      <Hero cta={heroCta as any} />

      <div
        id="explore-collections"
        className="relative z-20 mt-[-5vh] rounded-t-[2rem] bg-cream/85 text-brand-text shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.15)] backdrop-blur-md"
      >
        <div className="pt-14 md:pt-16">
          <Suspense fallback={<SectionFallback className="min-h-[520px]" />}>
            <CategoryBento categories={categoryCards as any} />
          </Suspense>
        </div>

        <div className="py-8 md:py-12">
          <Suspense fallback={<SectionFallback className="min-h-[640px]" />}>
            <EditorialSection bentoItems={bentoItems as any} />
          </Suspense>
        </div>

        <div className="section-deferred py-8 md:py-12">
          <Suspense fallback={<SectionFallback className="min-h-[420px]" />}>
            <JournalSection cards={journalCards as any} />
          </Suspense>
        </div>

        <div className="section-deferred">
          <Suspense fallback={<SectionFallback className="min-h-[420px]" />}>
            <WhyChooseUs promises={brandPromises as any} />
          </Suspense>
        </div>

        <div className="section-deferred py-8 md:py-12 px-6">
          <Suspense fallback={<SectionFallback className="min-h-[200px]" />}>
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

const HOMEPAGE_QUERY = `#graphql
  query seoCollectionContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
      heroCtaEn: metafield(namespace: "hero", key: "cta_en") { value }
      heroCtaAr: metafield(namespace: "hero", key: "cta_ar") { value }
    }
    bentoMetaobjects: metaobjects(type: "bento_item", first: 4) {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image { url width height altText }
            }
          }
        }
      }
    }
    categoryMetaobjects: metaobjects(type: "category_card", first: 6) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image { url width height altText }
            }
          }
        }
      }
    }
    journalMetaobjects: metaobjects(type: "journal_card", first: 6) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image { url width height altText }
            }
          }
        }
      }
    }
    promiseMetaobjects: metaobjects(type: "brand_promise", first: 8) {
      nodes {
        id
        fields { key value }
      }
    }
  }
` as const;
