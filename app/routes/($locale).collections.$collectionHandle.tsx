import {json} from '@remix-run/server-runtime';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useRouteError, isRouteErrorResponse, Link as RemixLink} from '@remix-run/react';
import {motion} from 'framer-motion';

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

import {ProductCardClean} from '~/components/ProductCardClean';
import {CategoryHeader} from '~/components/CategoryHeader';
import SortMenu, {
  type SortParam,
  FILTER_URL_PREFIX,
} from '~/components/SortFilter';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {getImageLoadingPriority} from '~/lib/const';
import {parseAsCurrency} from '~/lib/utils';
import {useTranslation} from '~/hooks/useTranslation';
import {translations} from '~/lib/translations';

export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 16,
  });
  const {collectionHandle} = params;
  const locale = context.storefront.i18n;
  // ... (rest of loader remains same until label logic) ...
  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;

  const {sortKey, reverse} = getSortValuesFromParam(
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

  let {collection, collections} = await context.storefront.query(
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

  if (!collection) {
    throw new Response('Collection not found', {status: 404});
  }

  if (
    (collection.products.nodes.length === 0) &&
    (collectionHandle === 'new-in' ||
      collectionHandle === 'new' ||
      collectionHandle === 'sunglasses' ||
      collectionHandle === 'sale' ||
      collectionHandle === 'phone-cases' ||
      collectionHandle === 'phone-straps' ||
      collectionHandle === 'case-strap-bundles')
  ) {
    // Fallback: query all products directly since the collection handle doesn't exist
    const {products: allProducts} = await context.storefront.query(
      ALL_PRODUCTS_FALLBACK_QUERY,
      {
        variables: {
          first: 16,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      },
    );

    if (allProducts?.nodes?.length) {
      const lang = context.storefront.i18n.language === 'AR' ? 'AR' : 'EN';
      // @ts-ignore
      let title: string = translations[lang]['nav.newIn'] as string;
      if (collectionHandle === 'sunglasses') title = 'Sunglasses';
      if (collectionHandle === 'sale') title = 'Sale';
      if (collectionHandle === 'phone-cases') title = 'Phone Cases';
      if (collectionHandle === 'phone-straps') title = 'Phone Straps';
      if (collectionHandle === 'case-strap-bundles')
        title = 'Case+Strap Bundles';

      // Create a synthetic collection object
      collection = {
        id: `synthetic-${collectionHandle}`,
        handle: collectionHandle,
        title,
        description: '',
        seo: {title, description: ''},
        image: null,
        products: {
          nodes: allProducts.nodes,
          filters: [],
          pageInfo: allProducts.pageInfo,
        },
      } as any;
    }
  }

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const seo = seoPayload.collection({collection, url: request.url});

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

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collection() {
  const {collection, appliedFilters, collections} =
    useLoaderData<typeof loader>();
  const {t} = useTranslation();

  // Collection hero image overrides
  const HERO_OVERRIDES: Record<
    string,
    {src: string; hideTitle?: boolean; fit?: 'cover' | 'contain'; bg?: string}
  > = {
    sunglasses: {
      src: '/assets/heros/sunglasses-hero.png',
      hideTitle: true,
      fit: 'contain',
      bg: '#E2E2E2',
    },
    'phone-cases': {
      src: '/assets/heros/phone-accessories-hero.png',
    },
    'phone-straps': {
      src: '/assets/heros/phone-accessories-hero.png',
    },
    'case-strap-bundles': {
      src: '/assets/heros/phone-accessories-hero.png',
    },
  };

  const override = HERO_OVERRIDES[collection.handle];
  const heroImage = override?.src || collection.image?.url;
  const hideTitle = override?.hideTitle;
  const heroFit = override?.fit || 'cover';
  const heroBg = override?.bg || '';

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* ─── Hero Banner ─── */}
      <div
        className={`relative w-full overflow-hidden ${
          heroFit === 'contain'
            ? ''
            : 'h-[30vh] md:h-[38vh] min-h-[220px] max-h-[380px]'
        }`}
        style={heroBg ? {backgroundColor: heroBg} : {}}
      >
        {heroImage ? (
          <>
            <motion.img
              src={heroImage}
              alt={collection.title}
              className={`w-full ${
                heroFit === 'contain' ? 'h-auto block' : 'h-full object-cover'
              }`}
              initial={{scale: 1.03}}
              animate={{scale: 1}}
              transition={{duration: 1.2, ease: [0.25, 0.1, 0.25, 1]}}
            />
            {heroFit === 'cover' && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/70 via-[#1a1510]/15 to-transparent" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2118] via-[#1a1510] to-[#0f0d0a]" />
        )}
        {/* Title overlay */}
        {!hideTitle && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 md:pb-10 px-6">
            <motion.div
              className="text-center"
              initial={{opacity: 0, y: 16}}
              animate={{opacity: 1, y: 0}}
              transition={{
                delay: 0.2,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] font-light mb-3">
                Collection
              </span>
              <h1
                className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F0EAE6] tracking-tight mb-3"
                style={{letterSpacing: '0.02em'}}
              >
                {collection.title}
              </h1>
              {collection.description && (
                <p className="max-w-lg mx-auto text-[#F0EAE6]/55 text-sm font-light tracking-wide leading-relaxed">
                  {collection.description}
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* ─── Category Navigation Tabs ─── */}
      <CategoryHeader
        currentCategory={collection.title}
        productCount={collection.products.nodes.length}
        collectionHandle={collection.handle}
      />

      {/* ─── Sort / Applied Filters Bar ─── */}
      <div
        className="max-w-[1440px] mx-auto py-3 flex items-center justify-between"
        style={{padding: '0.75rem var(--page-gutter)'}}
      >
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#8B7355]"
        >
          <a
            href="/"
            className="hover:text-[#a87441] transition-colors duration-200"
          >
            Home
          </a>
          <span aria-hidden="true" className="text-[#8B7355]/40">
            ›
          </span>
          <a
            href="/collections"
            className="hover:text-[#a87441] transition-colors duration-200"
          >
            Collections
          </a>
          <span aria-hidden="true" className="text-[#8B7355]/40">
            ›
          </span>
          <span className="text-[#4A3C31] font-medium truncate max-w-[180px]">
            {collection.title}
          </span>
        </nav>
        <div className="flex items-center gap-4">
          <SortMenu />
          {appliedFilters.length > 0 && (
            <div className="flex items-center gap-2">
              {appliedFilters.map((filter, i) => (
                <span
                  key={i}
                  className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#4A3C31]/6 text-[#4A3C31] rounded-full"
                >
                  {filter.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Product Grid ─── */}
      <main
        className="max-w-[1440px] mx-auto py-10 md:py-16"
        style={{padding: '2.5rem var(--page-gutter)'}}
      >
        <Pagination connection={collection.products}>
          {({
            nodes,
            isLoading,
            PreviousLink,
            NextLink,
            hasPreviousPage,
            hasNextPage,
          }) => (
            <>
              {/* Product Grid - Professional layout */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8 lg:gap-x-5 lg:gap-y-10">
                {nodes.map((product: any, i: number) => (
                  <ProductCardClean
                    key={product.id}
                    product={product}
                    index={i}
                  />
                ))}
              </div>

              {/* Pagination Bar */}
              {(hasPreviousPage || hasNextPage) && (
                <nav className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-[#4A3C31]/8">
                  {hasPreviousPage ? (
                    <PreviousLink className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31] border border-[#4A3C31]/15 hover:border-[#a87441] hover:text-[#a87441] transition-all duration-300 rounded">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      {isLoading ? t('collection.loading') : 'Previous'}
                    </PreviousLink>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31]/25 border border-[#4A3C31]/8 cursor-not-allowed rounded">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                  )}

                  {hasNextPage ? (
                    <NextLink className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31] border border-[#4A3C31]/15 hover:border-[#a87441] hover:text-[#a87441] transition-all duration-300 rounded">
                      {isLoading ? t('collection.loading') : 'Next'}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </NextLink>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31]/25 border border-[#4A3C31]/8 cursor-not-allowed rounded">
                      Next
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </nav>
              )}
            </>
          )}
        </Pagination>

        {/* Empty state */}
        {collection.products.nodes.length === 0 && (
          <div className="text-center py-32">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#a87441]/30 to-transparent mx-auto mb-6" />
            <p className="font-serif text-xl text-[#4A3C31]/35 italic">
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

const ALL_PRODUCTS_FALLBACK_QUERY = `#graphql
  query AllProductsFallback(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center min-h-[50vh]">
      <h1 className="font-serif text-3xl md:text-4xl text-[#4A3C31] mb-4">
        {is404 ? 'Collection Not Found' : 'Something went wrong'}
      </h1>
      <p className="text-[#8B8076] mb-8 max-w-md">
        {is404
          ? "We couldn't find this collection. It may have been removed or renamed."
          : 'There was an error loading this collection. Please try again.'}
      </p>
      <RemixLink
        to="/collections"
        className="inline-block bg-[#a87441] text-white text-xs uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#8B5E34] transition-colors"
      >
        View All Collections
      </RemixLink>
    </div>
  );
}
