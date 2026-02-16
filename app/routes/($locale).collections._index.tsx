import { json } from '@remix-run/server-runtime';
import {
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { useLoaderData, Link } from '@remix-run/react';
import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import {
  Image,
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';
import { motion } from 'framer-motion';

import { Button } from '~/components/Button';
import { getImageLoadingPriority } from '~/lib/const';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import { useTranslation } from '~/hooks/useTranslation';

const PAGINATION_SIZE = 12;

export const headers = routeHeaders;

export const loader = async ({
  request,
  context: { storefront },
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, { pageBy: PAGINATION_SIZE });
  const { collections } = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json({ collections, seo });
};

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <main className="container mx-auto px-4 md:px-6 py-16 md:py-24 min-h-screen text-[#4A3C31]">
      <header className="mb-10 md:mb-16 text-center">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4 text-[#4A3C31]">
          {t('collections.title', 'Collections')}
        </h1>
      </header>

      <Pagination connection={collections}>
        {({ nodes, isLoading, PreviousLink, NextLink }) => (
          <>
            <div className="flex items-center justify-center mb-8">
              <Button as={PreviousLink} variant="secondary" width="full">
                {isLoading ? t('collection.loading', 'Loading...') : t('collection.loadPrevious', 'Previous')}
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6"
            >
              {(nodes as Collection[]).map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                >
                  <CollectionCard
                    collection={collection}
                    loading={getImageLoadingPriority(i, 2)}
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

function CollectionCard({
  collection,
  loading,
}: {
  collection: Collection;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <Link
      prefetch="viewport"
      to={`/collections/${collection.handle}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg md:rounded-xl bg-[#F0EAE6] mb-3 shadow-sm">
        {collection?.image ? (
          <Image
            data={collection.image}
            aspectRatio="3/4"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            loading={loading}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E8DDD4] to-[#D4C5B9] flex items-center justify-center">
            <span className="text-[#8B8076] text-sm font-serif italic">{collection.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 rounded-lg md:rounded-xl" />
      </div>
      <h3 className="font-serif text-[14px] md:text-[15px] text-[#4A3C31] group-hover:text-[#a87441] transition-colors duration-300 line-clamp-1">
        {collection.title}
      </h3>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
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
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
