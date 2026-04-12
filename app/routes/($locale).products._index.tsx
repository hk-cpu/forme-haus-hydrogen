import {json} from '@remix-run/server-runtime';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {motion} from 'framer-motion';
import invariant from 'tiny-invariant';
import {
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {ProductCardClean} from '~/components/ProductCardClean';
import {InfinityProductShowcase} from '~/components/InfinityProductShowcase';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

const PAGE_BY = 16;

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

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
      descriptionHtml:
        'Discover our complete collection of luxury phone accessories',
      description:
        'Discover our complete collection of luxury phone accessories',
      seo: {
        title: 'All Products | Formé Haus',
        description: 'Browse all luxury phone cases, straps, and accessories',
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

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();
  const {isRTL} = useTranslation();

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <Section className="py-8 md:py-10">
        <Pagination connection={products}>
          {({
            nodes,
            isLoading,
            NextLink,
            PreviousLink,
            hasPreviousPage,
            hasNextPage,
          }) => (
            <>
              <div
                className="max-w-[1440px] mx-auto"
                style={{padding: '0 var(--page-gutter)'}}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                  {[...nodes]
                    .sort(() => Math.random() - 0.5)
                    .map((product: any, i: number) => (
                    <ProductCardClean
                      key={product.id}
                      product={product}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              {(hasPreviousPage || hasNextPage) && (
                <nav className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-[#4A3C31]/10">
                  {hasPreviousPage ? (
                    <PreviousLink className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31] border border-[#4A3C31]/20 hover:border-[#a87441] hover:text-[#a87441] transition-all duration-300 rounded-full">
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
                      {isLoading ? 'Loading...' : 'Previous'}
                    </PreviousLink>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31]/30 border border-[#4A3C31]/10 cursor-not-allowed rounded-full">
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
                    <NextLink className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31] border border-[#4A3C31]/20 hover:border-[#a87441] hover:text-[#a87441] transition-all duration-300 rounded-full">
                      {isLoading ? 'Loading...' : 'Next'}
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
                    <span className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#4A3C31]/30 border border-[#4A3C31]/10 cursor-not-allowed rounded-full">
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
      </Section>
    </div>
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
