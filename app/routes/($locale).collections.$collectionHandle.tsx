import { json } from '@remix-run/server-runtime';
import { type MetaArgs, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';
import type {
  Filter,
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {
  Pagination,
  flattenConnection,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
  CacheShort,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import { Button } from '~/components/Button';
import { ProductCard } from '~/components/ProductCard';
import { type SortParam, FILTER_URL_PREFIX } from '~/components/SortFilter';
import { PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { routeHeaders } from '~/data/cache';
import { seoPayload } from '~/lib/seo.server';
import { getImageLoadingPriority } from '~/lib/const';
import { parseAsCurrency } from '~/lib/utils';
import { useTranslation } from '~/hooks/useTranslation';
import { translations } from '~/lib/translations';

export const headers = routeHeaders;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });
  const { collectionHandle } = params;
  const locale = context.storefront.i18n;
  // ... (rest of loader remains same until label logic) ...
  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;

  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  let { collection, collections } = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
      cache: CacheShort(),
    },
  );


  if (!collection && (collectionHandle === 'new-in' || collectionHandle === 'new' || collectionHandle === 'sunglasses')) {
    const { collection: allCollection } = await context.storefront.query(
      COLLECTION_QUERY,
      {
        variables: {
          ...paginationVariables,
          handle: 'all',
          filters,
          sortKey: 'CREATED',
          reverse: true,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      },
    );

    if (allCollection) {
      collection = allCollection;
      const lang = context.storefront.i18n.language === 'AR' ? 'AR' : 'EN';
      // @ts-ignore
      collection.title = collectionHandle === 'sunglasses' ? 'Sunglasses' : translations[lang]['nav.newIn'];
      collection.description = '';
    }
  }

  if (!collection) {
    throw new Response('collection', { status: 404 });
  }

  const seo = seoPayload.collection({ collection, url: request.url });

  const allFilterValues = collection.products.filters.flatMap(
    (filter: Filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter: ProductFilter) => {
      const foundValue = allFilterValues.find(
        (value: Filter['values'][number]) => {
          const valueInput = JSON.parse(value.input as string) as ProductFilter;
          // special case for price, the user can enter something freeform (still a number, though)
          // that may not make sense for the locale/currency.
          // Basically just check if the price filter is applied at all.
          if (valueInput.price && filter.price) {
            return true;
          }
          return (
            // This comparison should be okay as long as we're not manipulating the input we
            // get from the API before using it as a URL param.
            JSON.stringify(valueInput) === JSON.stringify(filter)
          );
        },
      );
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return json({
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
    seo,
  });
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

/**
 * InfiniteScrollTrigger — auto-loads the next page when scrolled into view
 */
function InfiniteScrollTrigger({
  hasNextPage,
  nextPageUrl,
  isLoading,
  NextLink,
  loadingText,
}: {
  hasNextPage: boolean;
  nextPageUrl: string;
  isLoading: boolean;
  NextLink: any;
  loadingText: string;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const nextLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextLinkRef.current) {
          nextLinkRef.current.click();
        }
      },
      { rootMargin: '200px', threshold: 0 },
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isLoading, nextPageUrl]);

  if (!hasNextPage) return null;

  return (
    <div ref={triggerRef} className="flex items-center justify-center mt-14">
      {isLoading ? (
        <div className="flex items-center gap-3 text-[#8B7355]">
          <motion.div
            className="w-5 h-5 border-2 border-[#a87441]/30 border-t-[#a87441] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <span className="text-xs uppercase tracking-[0.2em] font-light">
            {loadingText}
          </span>
        </div>
      ) : (
        <NextLink ref={nextLinkRef} className="sr-only">
          Load more
        </NextLink>
      )}
    </div>
  );
}

export default function Collection() {
  const { collection, appliedFilters, collections } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  // Collection hero image
  const heroImage = collection.image?.url;

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* ─── Hero Banner ─── */}
      <div className="relative w-full h-[45vh] min-h-[320px] max-h-[520px] overflow-hidden">
        {heroImage ? (
          <>
            <motion.img
              src={heroImage}
              alt={collection.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/70 via-[#1a1510]/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2118] via-[#1a1510] to-[#0f0d0a]" />
        )}
        {/* Title overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] font-light mb-3">
              Collection
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#F0EAE6] tracking-tight mb-3">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="max-w-xl mx-auto text-[#F0EAE6]/60 text-sm font-light tracking-wide leading-relaxed">
                {collection.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ─── Sort / Filter Toolbar ─── */}
      <div className="sticky top-0 z-30 bg-[#F9F5F0]/95 backdrop-blur-md border-b border-[#4A3C31]/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B7355] font-light">
            {collection.products.nodes.length}{' '}
            {collection.products.nodes.length === 1
              ? t('collection.item')
              : t('collection.items')}
          </span>
          <div className="flex items-center gap-4">
            {appliedFilters.length > 0 && (
              <div className="flex items-center gap-2">
                {appliedFilters.map((filter, i) => (
                  <span
                    key={i}
                    className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#4A3C31]/10 text-[#4A3C31] rounded-sm"
                  >
                    {filter.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Product Grid ─── */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <Pagination connection={collection.products}>
          {({ nodes, isLoading, PreviousLink, NextLink, hasNextPage, nextPageUrl, state }) => (
            <>
              {/* Previous Link */}
              <div className="flex items-center justify-center mb-10">
                <Button as={PreviousLink} variant="secondary" width="full">
                  {isLoading
                    ? t('collection.loading')
                    : t('collection.loadPrevious')}
                </Button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                {nodes.map((product: any, i: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: (i % 4) * 0.06,
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              <InfiniteScrollTrigger
                hasNextPage={hasNextPage}
                nextPageUrl={nextPageUrl}
                isLoading={isLoading}
                NextLink={NextLink}
                loadingText={t('collection.loading')}
              />
            </>
          )}
        </Pagination>

        {/* Empty state */}
        {collection.products.nodes.length === 0 && (
          <div className="text-center py-24">
            <p className="font-serif text-xl text-[#4A3C31]/40 italic">
              {t('collection.noProducts')}
            </p>
          </div>
        )}

        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      </main>
    </div>
  );
}


const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
    collections(first: 100) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
