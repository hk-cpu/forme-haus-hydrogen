import {json} from '@remix-run/server-runtime';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

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

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#4A3C31] text-[#F0EAE6]">
      <div className="py-24 text-center">
        <h1 className="font-serif italic font-light text-5xl md:text-6xl text-[#F0EAE6] mb-4">
          All Products
        </h1>
        <div className="w-24 h-px bg-[#a87441]/60 mx-auto" />
      </div>
      <Section>
        <Pagination connection={products}>
          {({nodes, isLoading, NextLink, PreviousLink, hasPreviousPage, hasNextPage}) => (
            <>
              {/* Product Grid - 4 columns */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                {nodes.map((product: any, i: number) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination Bar */}
              {(hasPreviousPage || hasNextPage) && (
                <nav className="flex items-center justify-center gap-6 mt-14 pt-8 border-t border-[#F0EAE6]/20">
                  {hasPreviousPage ? (
                    <PreviousLink className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] border border-[#F0EAE6]/20 hover:border-[#a87441] hover:text-[#a87441] transition-colors duration-300">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      {isLoading ? 'Loading...' : 'Previous'}
                    </PreviousLink>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6]/30 border border-[#F0EAE6]/10 cursor-not-allowed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                  )}

                  {hasNextPage ? (
                    <NextLink className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] border border-[#F0EAE6]/20 hover:border-[#a87441] hover:text-[#a87441] transition-colors duration-300">
                      {isLoading ? 'Loading...' : 'Next'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </NextLink>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6]/30 border border-[#F0EAE6]/10 cursor-not-allowed">
                      Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
