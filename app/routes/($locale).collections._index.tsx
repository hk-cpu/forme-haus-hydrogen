import {json} from '@remix-run/server-runtime';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {
  Image,
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Grid} from '~/components/Grid';
import {Heading, PageHeader, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {motion} from 'framer-motion';

// Premium brand images for collections
const COLLECTION_HEROS: Record<string, string> = {
  sunglasses: '/assets/heros/sunglasses-hero.png',
  'new-in': '/brand/new-in.webp',
  'phone-cases': '/brand/phone-accessories.webp',
  'phone-straps': '/brand/phone-accessories.webp',
  'case-strap-bundles': '/brand/phone-accessories.webp',
  sale: '/brand/edit-modern-essentials.webp',
};

const PAGINATION_SIZE = 4;

export const headers = routeHeaders;

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  let {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  // Inject synthetic collections (New In, Sale) if they don't exist natively.
  const existingHandles = collections.nodes.map((c: any) => c.handle);

  const syntheticCollections = [];

  if (!existingHandles.includes('new-in')) {
    syntheticCollections.push({
      id: 'synthetic-new-in',
      handle: 'new-in',
      title: 'New In',
      description: 'Latest additions to the Haus.',
      image: null,
      seo: {title: 'New In', description: ''},
    });
  }

  if (!existingHandles.includes('sale')) {
    syntheticCollections.push({
      id: 'synthetic-sale',
      handle: 'sale',
      title: 'Sale',
      description: 'Shop reduced items.',
      image: null,
      seo: {title: 'Sale', description: ''},
    });
  }

  // Prepend synthetic collections to the nodes
  collections = {
    ...collections,
    nodes: [...syntheticCollections, ...collections.nodes],
  };

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json({collections, seo});
};

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#F9F5F0] py-16">
      <div className="mx-auto max-w-[1440px] px-[var(--page-gutter)]">
        <div className="mb-12 text-center">
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4">
            Discover
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#4A3C31]">
            All Collections
          </h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />
        </div>

        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="flex items-center justify-center mb-8">
                <Button as={PreviousLink} variant="secondary">
                  {isLoading ? 'Loading...' : '↑ Previous'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {(nodes as Collection[]).map((collection, i) => (
                  <motion.div
                    key={collection.id}
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: i * 0.1}}
                  >
                    <CollectionCard collection={collection} />
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-center mt-12">
                <Button as={NextLink} variant="secondary">
                  {isLoading ? 'Loading...' : 'Load More ↓'}
                </Button>
              </div>
            </>
          )}
        </Pagination>
      </div>
    </div>
  );
}

function CollectionCard({
  collection,
  loading,
}: {
  collection: Collection;
  loading?: HTMLImageElement['loading'];
}) {
  const imgSrc = COLLECTION_HEROS[collection.handle] || collection.image?.url;

  return (
    <Link
      prefetch="viewport"
      to={`/collections/${collection.handle}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-[#f0eae6]"
    >
      {imgSrc ? (
        <motion.img
          src={imgSrc}
          alt={collection.title}
          className="h-full w-full object-cover"
          initial={{scale: 1}}
          whileHover={{scale: 1.05}}
          transition={{duration: 0.8, ease: [0.25, 0.1, 0.25, 1]}}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#4A3C31]/5 text-[#4A3C31]/40">
          <span className="font-serif text-xl italic">{collection.title}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="font-serif text-2xl text-[#F0EAE6]">
          {collection.title}
        </h3>
        <div className="mt-2 h-px w-0 bg-[#D4AF87] transition-all duration-500 group-hover:w-12" />
      </div>
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
