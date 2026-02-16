import {
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { defer } from '@remix-run/server-runtime';
import { Await, Form, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import {
  Pagination,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';
import { motion } from 'framer-motion';

import { Text } from '~/components/Text';
import { Input } from '~/components/Input';
import { Button } from '~/components/Button';
import { ProductCard } from '~/components/ProductCard';
import { ProductSwimlane } from '~/components/ProductSwimlane';
import { FeaturedCollections } from '~/components/FeaturedCollections';
import { PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { getImageLoadingPriority, PAGINATION_SIZE } from '~/lib/const';
import { seoPayload } from '~/lib/seo.server';
import { useTranslation } from '~/hooks/useTranslation';
import type { ProductCardFragment } from 'storefrontapi.generated';

import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';

export async function loader({
  request,
  context: { storefront },
}: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q')!;
  const variables = getPaginationVariables(request, { pageBy: 8 });

  const { products } = await storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0;

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'search',
      title: 'Search',
      handle: 'search',
      descriptionHtml: 'Search results',
      description: 'Search results',
      seo: {
        title: 'Search',
        description: `Showing ${products.nodes.length} search results for "${searchTerm}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return defer({
    seo,
    searchTerm,
    products,
    noResultRecommendations: shouldGetRecommendations
      ? getNoResultRecommendations(storefront)
      : Promise.resolve(null),
  });
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Search() {
  const { searchTerm, products, noResultRecommendations } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const noResults = products?.nodes?.length === 0;

  return (
    <main className="container mx-auto px-4 md:px-6 py-16 md:py-24 min-h-screen text-[#4A3C31]">
      {/* Search Header */}
      <header className="mb-10 md:mb-16 text-center space-y-6">
        <h1 className="font-serif text-3xl md:text-5xl text-[#4A3C31]">
          {t('search.title', 'Search')}
        </h1>
        <Form method="get" className="relative flex w-full max-w-xl mx-auto">
          <Input
            defaultValue={searchTerm}
            name="q"
            placeholder={t('search.placeholder', 'Search...')}
            type="search"
            variant="search"
            className="w-full"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#a87441] hover:text-[#8B5E3C] font-medium uppercase tracking-wider transition-colors"
            type="submit"
          >
            {t('search.go', 'Go')}
          </button>
        </Form>
      </header>

      {!searchTerm || noResults ? (
        <NoResults
          noResults={noResults}
          recommendations={noResultRecommendations}
        />
      ) : (
        <Pagination connection={products}>
          {({ nodes, isLoading, NextLink, PreviousLink }) => (
            <>
              <div className="flex items-center justify-center mb-8">
                <Button as={PreviousLink} variant="secondary" width="full">
                  {isLoading ? t('collection.loading', 'Loading...') : t('collection.loadPrevious', 'Previous')}
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-5 md:gap-y-10 lg:gap-x-6 lg:gap-y-12"
              >
                {(nodes as ProductCardFragment[]).map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.03, ease: 'easeOut' }}
                  >
                    <ProductCard
                      product={product}
                      loading={getImageLoadingPriority(i)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex items-center justify-center mt-8">
                <Button as={NextLink} variant="secondary" width="full">
                  {isLoading ? t('collection.loading', 'Loading...') : t('collection.loadMore', 'Load more')}
                </Button>
              </div>
            </>
          )}
        </Pagination>
      )}
      <Analytics.SearchView data={{ searchTerm, searchResults: products }} />
    </main>
  );
}

function NoResults({
  noResults,
  recommendations,
}: {
  noResults: boolean;
  recommendations: Promise<null | FeaturedData>;
}) {
  return (
    <>
      {noResults && (
        <div className="text-center py-12">
          <p className="text-[#8B8076] italic font-serif text-lg">
            No results, try a different search.
          </p>
        </div>
      )}
      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) return null;
            const { featuredCollections, featuredProducts } = result;

            return (
              <>
                <FeaturedCollections
                  title="Trending Collections"
                  collections={featuredCollections}
                />
                <ProductSwimlane
                  title="Trending Products"
                  products={featuredProducts}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export function getNoResultRecommendations(
  storefront: LoaderFunctionArgs['context']['storefront'],
) {
  return getFeaturedData(storefront, { pageBy: PAGINATION_SIZE });
}

const SEARCH_QUERY = `#graphql
  query PaginatedProductsSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $searchTerm: String
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
` as const;
