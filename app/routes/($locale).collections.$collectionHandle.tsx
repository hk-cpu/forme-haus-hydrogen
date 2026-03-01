import {json} from '@remix-run/server-runtime';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useLocation} from '@remix-run/react';
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

import {ProductCard} from '~/components/ProductCard';
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

  if (collection) {
    console.log('[DEBUG] Collection found:', collection.handle, 'Products:', collection.products?.nodes?.length);
  } else {
    console.log('[DEBUG] Collection NOT found for handle:', collectionHandle);
  }

  if (
    (!collection || collection.products.nodes.length === 0) &&
    (collectionHandle === 'new-in' ||
      collectionHandle === 'new' ||
      collectionHandle === 'sunglasses' ||
      collectionHandle === 'sale')
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
      if(collectionHandle === 'sunglasses') title = 'Sunglasses';
      if(collectionHandle === 'sale') title = 'Sale';

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
  const location = useLocation();

  // Collection hero image
  const heroImage = collection.image?.url;

  // Phone Accessories sub-nav: show tabs on phone-related collection pages
  const phoneAccessoriesHandles = ['phone-cases', 'phone-straps', 'case-strap-bundles'];
  const isPhoneAccessoriesCategory = phoneAccessoriesHandles.includes(collection.handle);

  const phoneSubNavTabs = [
    {label: 'Phone Cases', href: '/collections/phone-cases'},
    {label: 'Phone Straps', href: '/collections/phone-straps'},
    {label: 'Case+Strap Bundles', href: '/collections/case-strap-bundles'},
  ];

  // Display title: rename "Phone Cases" → "Phone Accessories" for the parent category
  const displayTitle = collection.handle === 'phone-cases'
    ? 'Phone Accessories'
    : collection.title;

  // Hide description on phone-cases collection per spec
  const showDescription = collection.description && collection.handle !== 'phone-cases';

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* ─── Hero Banner ─── */}
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[280px] max-h-[480px] overflow-hidden">
        {heroImage ? (
          <>
            <motion.img
              src={heroImage}
              alt={displayTitle}
              className="w-full h-full object-cover"
              initial={{scale: 1.03}}
              animate={{scale: 1}}
              transition={{duration: 1.2, ease: [0.25, 0.1, 0.25, 1]}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/70 via-[#1a1510]/15 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2118] via-[#1a1510] to-[#0f0d0a]" />
        )}
        {/* Title overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:pb-14 px-6">
          <motion.div
            className="text-center"
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1]}}
          >
            <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] font-light mb-3">
              Collection
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#F0EAE6] tracking-tight mb-3" style={{letterSpacing: '0.02em'}}>
              {displayTitle}
            </h1>
            {showDescription && (
              <p className="max-w-lg mx-auto text-[#F0EAE6]/55 text-sm font-light tracking-wide leading-relaxed">
                {collection.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ─── Sub-Navigation Tabs (Phone Accessories) or Breadcrumb ─── */}
      {isPhoneAccessoriesCategory ? (
        <nav
          aria-label="Category navigation"
          className="max-w-[1440px] mx-auto pt-5 pb-2"
          style={{padding: '1.25rem var(--page-gutter) 0.5rem'}}
        >
          <div className="flex items-center gap-6 md:gap-8">
            {phoneSubNavTabs.map((tab) => {
              const isActive = location.pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`relative text-[12px] md:text-[13px] uppercase tracking-[0.12em] pb-2 transition-colors duration-300 ${
                    isActive
                      ? 'text-[#4A3C31] font-medium'
                      : 'text-[#8B7355] hover:text-[#a87441]'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="phone-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a87441]"
                      transition={{duration: 0.3, ease: [0.25, 0.1, 0.25, 1]}}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : (
        <nav
          aria-label="Breadcrumb"
          className="max-w-[1440px] mx-auto pt-5 pb-2"
          style={{padding: '1.25rem var(--page-gutter) 0.5rem'}}
        >
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#8B7355]">
            <li>
              <a href="/" className="hover:text-[#a87441] transition-colors duration-200">
                Home
              </a>
            </li>
            <li aria-hidden="true" className="text-[#8B7355]/40">&rsaquo;</li>
            <li>
              <a href="/collections" className="hover:text-[#a87441] transition-colors duration-200">
                Collections
              </a>
            </li>
            <li aria-hidden="true" className="text-[#8B7355]/40">&rsaquo;</li>
            <li className="text-[#4A3C31] font-medium truncate max-w-[180px]">
              {displayTitle}
            </li>
          </ol>
        </nav>
      )}

      {/* ─── Sort / Filter Toolbar ─── */}
      <div className="sticky z-30 bg-[#F9F5F0]/[0.97] backdrop-blur-xl border-b border-[#4A3C31]/8" style={{top: 'var(--navbar-height)'}}>
        <div className="max-w-[1440px] mx-auto py-3 flex items-center justify-between" style={{padding: '0.75rem var(--page-gutter)'}}>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B7355] font-light">
            {collection.products.nodes.length}{' '}
            {collection.products.nodes.length === 1
              ? t('collection.item')
              : t('collection.items')}
          </span>
          <div className="flex items-center gap-4">
            <SortMenu />
            {appliedFilters.length > 0 && (
              <div className="flex items-center gap-2">
                {appliedFilters.map((filter, i) => (
                  <span
                    key={i}
                    className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#4A3C31]/6 text-[#4A3C31] rounded"
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
      <main className="max-w-[1440px] mx-auto py-10 md:py-16" style={{padding: '2.5rem var(--page-gutter)'}}>
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
              {/* Product Grid - equal gaps all sides */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {nodes.map((product: any, i: number) => (
                  <motion.div
                    key={product.id}
                    initial={{opacity: 0, y: 16}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: '-40px'}}
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: (i % 4) * 0.05,
                    }}
                  >
                    <ProductCard product={product} index={i} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination Bar */}
              {(hasPreviousPage || hasNextPage) && (
                <nav className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-[#4A3C31]/8">
                  {hasPreviousPage ? (
                    <PreviousLink className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31] border border-[#4A3C31]/15 hover:border-[#a87441] hover:text-[#a87441] transition-all duration-300 rounded">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      {isLoading ? t('collection.loading') : 'Previous'}
                    </PreviousLink>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31]/25 border border-[#4A3C31]/8 cursor-not-allowed rounded">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                  )}

                  {hasNextPage ? (
                    <NextLink className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31] border border-[#4A3C31]/15 hover:border-[#a87441] hover:text-[#a87441] transition-all duration-300 rounded">
                      {isLoading ? t('collection.loading') : 'Next'}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </NextLink>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31]/25 border border-[#4A3C31]/8 cursor-not-allowed rounded">
                      Next
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
