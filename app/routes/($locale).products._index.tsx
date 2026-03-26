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
  const {t, isRTL} = useTranslation();

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* Hero Banner with Image */}
      <div className="relative w-full h-[35vh] md:h-[40vh] min-h-[280px] max-h-[450px] overflow-hidden">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0"
          initial={{scale: 1.05}}
          animate={{scale: 1}}
          transition={{duration: 1.5, ease: [0.25, 0.1, 0.25, 1]}}
        >
          <img
            src="/brand/edit-modern-essentials.webp"
            alt="All Products"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/80 via-[#1a1510]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1510]/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.span
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2, duration: 0.6}}
            className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a87441] font-light mb-3"
          >
            {t('products.completeCollection', 'The Complete Collection')}
          </motion.span>
          <motion.h1
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3, duration: 0.6}}
            className="font-serif italic font-light text-4xl md:text-5xl lg:text-6xl text-[#F0EAE6] mb-4"
          >
            {t('products.allProducts', 'All Products')}
          </motion.h1>
          <motion.div
            initial={{scaleX: 0}}
            animate={{scaleX: 1}}
            transition={{delay: 0.5, duration: 0.8}}
            className="w-20 h-px bg-[#a87441]"
          />
        </div>
      </div>

      {/* Product Grid Section */}
      <Section className="py-12 md:py-16">
        {/* Section Header */}
        <div
          className="max-w-[1440px] mx-auto mb-8"
          style={{padding: '0 var(--page-gutter)'}}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#4A3C31]">
                {t('products.browseAll', 'Browse All')}
              </h2>
              <p className="text-sm text-[#8B8076] mt-1">
                {products.nodes.length}{' '}
                {products.nodes.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#8B8076]">
              <a href="/" className="hover:text-[#a87441] transition-colors">
                Home
              </a>
              <span className="text-[#8B8076]/40">›</span>
              <span className="text-[#4A3C31]">All Products</span>
            </nav>
          </div>
        </div>

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
              {/* Product Grid */}
              <div
                className="max-w-[1440px] mx-auto"
                style={{padding: '0 var(--page-gutter)'}}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                  {nodes.map((product: any, i: number) => (
                    <ProductCardClean
                      key={product.id}
                      product={product}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              {/* Pagination Bar */}
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
