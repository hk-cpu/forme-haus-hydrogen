import { json } from '@remix-run/server-runtime';
import {
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';
import { motion } from 'framer-motion';

import { ProductCard } from '~/components/ProductCard';
import { Button } from '~/components/Button';
import { PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { getImageLoadingPriority } from '~/lib/const';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import { useTranslation } from '~/hooks/useTranslation';
import type { ProductCardFragment } from 'storefrontapi.generated';

const PAGE_BY = 16;

export const headers = routeHeaders;

export async function loader({
  request,
  context: { storefront },
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, { pageBy: PAGE_BY });

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'all-products',
      title: 'All Products',
      handle: 'products',
      descriptionHtml: 'All the store products',
      description: 'All the store products',
      seo: {
        title: 'All Products',
        description: 'All the store products',
      },
      metafields: [],
      products: data.products,
      updatedAt: '',
    },
  });

  return json({
    products: data.products,
    seo,
  });
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function AllProducts() {
  const { products } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <main className="container mx-auto px-4 md:px-6 py-16 md:py-24 min-h-screen text-[#4A3C31]">
      <header className="mb-10 md:mb-16 text-center">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4 text-[#4A3C31]">
          {t('products.title', 'All Products')}
        </h1>
      </header>

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
    </main>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
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
