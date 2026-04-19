import {useRef, Suspense, useState, useEffect} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {motion, AnimatePresence} from 'framer-motion';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
import {
  useLoaderData,
  Await,
  useRouteError,
  isRouteErrorResponse,
  Link as RemixLink,
} from '@remix-run/react';
import {
  getSeoMeta,
  Money,
  ShopPayButton,
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  getProductOptions,
  type MappedProductOptions,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';

import type {ProductFragment} from 'storefrontapi.generated';
import {Heading, Section, Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {AddToCartButton} from '~/components/AddToCartButton';
import {BuyNowButton} from '~/components/BuyNowButton';
import {Skeleton} from '~/components/Skeleton';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {ProductGallery} from '~/components/ProductGallery';
import {TrustBadges} from '~/components/TrustBadges';
import {BundlePricing} from '~/components/BundlePricing';
import {IconCaret, IconCheck, IconClose} from '~/components/Icon';
import {useUI} from '~/context/UIContext';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders, CACHE_SHORT} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {useTranslation} from '~/hooks/useTranslation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/Breadcrumb';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {productHandle} = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer(
    {...deferredData, ...criticalData},
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  params,
  request,
  context,
}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const [{shop, product}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const relatedBundles = getRelatedBundles(
    context.storefront,
    product.id,
    product.title,
  );
  const selectedVariant = product.selectedOrFirstAvailableVariant ?? {};
  const variants = getAdjacentAndFirstAvailableVariants(product);

  const seo = seoPayload.product({
    product: {...product, variants},
    selectedVariant,
    url: request.url,
  });

  return {
    product,
    variants,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    relatedBundles,
    seo,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(args: LoaderFunctionArgs) {
  // Put any API calls that are not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

export default function Product() {
  const {product, shop, recommended, relatedBundles, variants, storeDomain} =
    useLoaderData<typeof loader>();
  const {
    media,
    title,
    vendor,
    descriptionHtml,
    frameShape,
    gender,
    frameMaterial,
    lensDescription,
    lensMaterial,
    uvProtection,
    frameWidth,
    frameHeight,
    lensWidth,
    noseBridge,
    templeLength,
    productCode,
    warranty,
    polarised,
    measurementImage,
  } = product;

  const specifications = [
    {label: 'Frame Shape', value: frameShape?.value},
    {label: 'Gender', value: gender?.value},
    {label: 'Frame Material', value: frameMaterial?.value},
    {label: 'Lens Description', value: lensDescription?.value},
    {label: 'Lens Material', value: lensMaterial?.value},
    {label: 'UV Protection', value: uvProtection?.value},
    {label: 'Frame Width', value: frameWidth?.value},
    {label: 'Frame Height', value: frameHeight?.value},
    {label: 'Lens Width', value: lensWidth?.value},
    {label: 'Nose Bridge', value: noseBridge?.value},
    {label: 'Temple Length', value: templeLength?.value},
    {label: 'Product Code', value: productCode?.value},
    {label: 'Warranty', value: warranty?.value},
    {label: 'Polarised', value: polarised?.value},
  ].filter((spec) => spec.value);

  const mImage = measurementImage?.reference?.image?.url;

  const specsHtml = (
    <div className="space-y-4">
      {specifications.length > 0 && (
        <ul className="space-y-1.5 list-none m-0 p-0">
          {specifications.map((s) => (
            <li key={s.label} className="flex text-[13px]">
              <span className="w-1/2 font-medium text-[#4A3C31]">
                {s.label}:
              </span>
              <span className="w-1/2 text-[#8B8076]">{s.value}</span>
            </li>
          ))}
        </ul>
      )}
      {mImage && (
        <div className="pt-4 border-t border-[#8B8076]/10">
          <p className="text-[11px] uppercase tracking-widest text-[#4A3C31] mb-2 font-medium">
            Measurement Image
          </p>
          <img
            src={mImage}
            alt="Measurement Guide"
            className="w-full h-auto rounded-lg bg-[#FAF8F5] p-4"
          />
        </div>
      )}
    </div>
  );
  const {t} = useTranslation();
  const {shippingPolicy, refundPolicy} = shop;

  // Extract iPhone models from tags (e.g., "iphone-17-pro", "iphone-17-pro-max")
  const iPhoneModels: string[] =
    product.tags
      ?.filter((tag: string) => tag.toLowerCase().startsWith('iphone-'))
      ?.map((tag: string) => {
        const match = tag.match(/iphone-?(\d+)-?(pro-?max|pro|max|plus|mini)/i);
        if (match) {
          const [, number, model] = match;
          return `iPhone ${number} ${model
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase())}`;
        }
        return tag
          .replace(/iphone-?/i, 'iPhone ')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
      }) || [];
  const isBundleEligible = iPhoneModels.length > 0;

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    variants,
  );
  const hasValidPrice = parseFloat(selectedVariant?.price?.amount || '0') > 0;
  const isPurchasable =
    Boolean(selectedVariant?.availableForSale) && hasValidPrice;

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  // Prevent "Default Title" from appearing in URL for single-variant products
  useSelectedOptionInUrlParam(
    selectedVariant.title !== 'Default Title'
      ? selectedVariant.selectedOptions
      : [],
  );

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Mobile sticky ATC
  const atcSentinelRef = useRef<HTMLDivElement>(null);
  const [showStickyAtc, setShowStickyAtc] = useState(false);
  const isOutOfStock = !selectedVariant?.availableForSale;

  useEffect(() => {
    const el = atcSentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyAtc(!entry.isIntersecting),
      {threshold: 0, rootMargin: '0px 0px -80px 0px'},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Section className="px-0 md:px-8 lg:px-12">
        {/* Breadcrumb - Added from migration */}
        <div className="block mb-6 px-4 md:px-0">
          <Breadcrumb variant="light">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink to="/collections/all">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid items-start md:gap-6 lg:gap-12 md:grid-cols-2">
          <ProductGallery media={media.nodes} className="w-full" />
          <div className="sticky md:top-24 md:h-[calc(100vh-6rem)] hiddenScroll md:overflow-y-auto">
            <section className="flex flex-col w-full max-w-xl gap-10 p-6 md:pl-10 lg:pl-16 md:mx-auto md:max-w-none">
              <div className="grid gap-3">
                {/* Brand Badge - LOUVE Collection */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#a87441] font-semibold">
                    LOUVE Collection
                  </span>
                  {iPhoneModels.length > 0 && (
                    <div className="flex gap-1.5">
                      {iPhoneModels
                        .slice(0, 2)
                        .map((model: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2.5 py-1 bg-[#a87441]/10 text-[#a87441] rounded-full font-medium"
                          >
                            {model}
                          </span>
                        ))}
                      {iPhoneModels.length > 2 && (
                        <span className="text-[10px] px-2 py-1 text-[#8B8076]">
                          +{iPhoneModels.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Heading
                  as="h1"
                  className="whitespace-normal font-serif text-3xl md:text-4xl lg:text-4xl text-[#2a2118] font-thin leading-[0.95] tracking-tight mb-2 hyphens-auto"
                >
                  {title}
                </Heading>

                {vendor && vendor !== 'LOUVE Collection' && (
                  <Text
                    className={
                      'opacity-60 font-sans tracking-[0.2em] uppercase text-xs text-[#8B8076]'
                    }
                  >
                    {vendor}
                  </Text>
                )}
              </div>
              <ProductForm
                productId={product.id}
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                storeDomain={storeDomain}
              />

              {/* Bundle Pricing Section */}
              {isBundleEligible ? (
                <div className="mt-6">
                  <BundlePricing variant="cards" />
                </div>
              ) : null}

              {/* Bundle \u2194 Individual Cross-Links */}
              <Suspense fallback={null}>
                <Await resolve={relatedBundles}>
                  {(data) =>
                    data && data.products && data.products.length > 0 ? (
                      <RelatedBundleLinks
                        mode={data.mode}
                        products={data.products}
                      />
                    ) : null
                  }
                </Await>
              </Suspense>

              {/* Trust Badges Section */}
              <div className="mt-6">
                <TrustBadges variant="full" />
              </div>
              <div className="grid gap-4 py-8 border-t border-[#8B8076]/20">
                {descriptionHtml && (
                  <ProductDetail
                    title={t('product.details')}
                    content={descriptionHtml}
                  />
                )}
                {(specifications.length > 0 || mImage) && (
                  <ProductDetail
                    title={t('product.specifications', 'Specifications')}
                    content={specsHtml as any}
                  />
                )}
                {shippingPolicy?.body && (
                  <ProductDetail
                    title={t('product.shipping')}
                    content={getExcerpt(shippingPolicy.body)}
                    learnMore={`/policies/${shippingPolicy.handle}`}
                  />
                )}
                {refundPolicy?.body && (
                  <ProductDetail
                    title={t('product.returns')}
                    content={getExcerpt(refundPolicy.body)}
                    learnMore={`/policies/${refundPolicy.handle}`}
                  />
                )}
              </div>
            </section>
            <div ref={atcSentinelRef} className="h-px w-full" />
          </div>
        </div>
      </Section>
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <ProductSwimlane title="Related Products" products={products} />
          )}
        </Await>
      </Suspense>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
      <AnimatePresence>
        {showStickyAtc && !isOutOfStock && (
          <motion.div
            initial={{y: 80, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 80, opacity: 0}}
            transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
            className="fixed bottom-0 left-0 right-0 z-[200] md:hidden bg-[#F9F5F0] border-t border-[#8B8076]/20 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[13px] text-[#2a2118] leading-tight truncate">
                {title}
              </p>
              <Money
                withoutTrailingZeros
                data={selectedVariant!.price!}
                as="p"
                className="text-[11px] text-[#8B8076] mt-0.5"
              />
            </div>
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant!.id!, quantity: 1}]}
              className="bg-[#2a2118] text-[#F0EAE6] px-6 py-3 text-[11px] uppercase tracking-[0.15em] rounded-sm shrink-0 transition-colors hover:bg-[#4A3C31] focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2"
            >
              {t('product.addToCart')}
            </AddToCartButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ProductForm({
  productId,
  productOptions,
  selectedVariant,
  storeDomain,
}: {
  productId: string;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  storeDomain: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const {toggleWishlist, isInWishlist} = useUI();

  const {t} = useTranslation();

  const hasValidPrice = parseFloat(selectedVariant?.price?.amount || '0') > 0;
  const isOutOfStock = !selectedVariant?.availableForSale || !hasValidPrice;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        {productOptions
          .filter((o) => o.name !== 'Title')
          .map((option, optionIndex) => (
            <div
              key={option.name}
              className="product-options flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
            >
              <Heading
                as="legend"
                size="lead"
                className="min-w-[4rem] text-[#5C5046] text-xs uppercase tracking-[0.15em] mb-3 font-medium"
              >
                {option.name}
              </Heading>
              <div className="flex flex-wrap items-baseline gap-3">
                {option.optionValues.length > 7 ? (
                  <div className="relative w-full">
                    <Listbox>
                      {({open}) => (
                        <>
                          <Listbox.Button
                            ref={closeRef}
                            className={clsx(
                              'flex items-center justify-between w-full py-3 px-4 border border-[#8B8076]/30 text-[#5C5046] bg-transparent hover:border-[#8B8076] transition-colors',
                              open ? 'rounded-t-sm border-b-0' : 'rounded-sm',
                            )}
                          >
                            <span>
                              {
                                selectedVariant?.selectedOptions[optionIndex]
                                  .value
                              }
                            </span>
                            <IconCaret
                              direction={open ? 'up' : 'down'}
                              className="text-[#5C5046]"
                            />
                          </Listbox.Button>
                          <Listbox.Options
                            className={clsx(
                              'border-[#8B8076]/20 bg-[#F9F5F0] text-[#5C5046] absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-sm border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto shadow-xl',
                              open
                                ? 'max-h-48 opacity-100'
                                : 'max-h-0 opacity-0',
                            )}
                          >
                            {option.optionValues
                              .filter((value) => value.available)
                              .map(
                                ({
                                  isDifferentProduct,
                                  name,
                                  variantUriQuery,
                                  handle,
                                  selected,
                                }) => (
                                  <Listbox.Option
                                    key={`option-${option.name}-${name}`}
                                    value={name}
                                  >
                                    <Link
                                      {...(!isDifferentProduct
                                        ? {rel: 'nofollow'}
                                        : {})}
                                      to={`/products/${handle}?${variantUriQuery}`}
                                      preventScrollReset
                                      className={clsx(
                                        'text-[#5C5046] w-full p-2 transition rounded-sm flex justify-start items-center text-left cursor-pointer hover:bg-[#8B8076]/10',
                                        selected &&
                                          'bg-[#8B8076]/10 font-medium',
                                      )}
                                      onClick={() => {
                                        if (!closeRef?.current) return;
                                        closeRef.current.click();
                                      }}
                                    >
                                      {name}
                                      {selected && (
                                        <span className="ml-2">
                                          <IconCheck />
                                        </span>
                                      )}
                                    </Link>
                                  </Listbox.Option>
                                ),
                              )}
                          </Listbox.Options>
                        </>
                      )}
                    </Listbox>
                  </div>
                ) : (
                  option.optionValues.map(
                    ({
                      isDifferentProduct,
                      name,
                      variantUriQuery,
                      handle,
                      selected,
                      available,
                      swatch,
                    }) => (
                      <div key={option.name + name} className="relative">
                        {!available ? null : (
                          <Link
                            {...(!isDifferentProduct ? {rel: 'nofollow'} : {})}
                            to={`/products/${handle}?${variantUriQuery}`}
                            preventScrollReset
                            prefetch="intent"
                            replace
                            className="block relative z-10"
                          >
                            <motion.div
                              whileHover={{scale: 1.05}}
                              whileTap={{scale: 0.95}}
                              className={clsx(
                                'leading-none py-3 px-5 border cursor-pointer transition-all duration-300 text-sm tracking-widest uppercase rounded-none min-w-[3rem] text-center font-light',
                                selected
                                  ? 'border-[#2a2118] text-[#F9F6F3] bg-[#2a2118]'
                                  : 'border-[#8B8076]/30 text-[#8B8076] hover:border-[#2a2118] hover:text-[#2a2118]',
                              )}
                            >
                              <ProductOptionSwatch
                                swatch={swatch}
                                name={name}
                              />
                            </motion.div>
                          </Link>
                        )}
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          ))}
        {selectedVariant && (
          <div className="grid items-stretch gap-4 pt-4">
            {isOutOfStock ? (
              <Button variant="secondary" disabled>
                <Text>
                  {hasValidPrice
                    ? t('product.soldOut')
                    : t('product.unavailable', 'Unavailable')}
                </Text>
              </Button>
            ) : (
              <motion.div whileTap={{scale: 0.98}} className="flex flex-col gap-3">
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: selectedVariant.id!,
                      quantity: 1,
                    },
                  ]}
                  variant="primary"
                  data-test="add-to-cart"
                  className="w-full bg-[#2a2118] hover:bg-[#4A3C31] text-[#F0EAE6] py-5 rounded-none transition-all duration-300 shadow-none hover:shadow-xl tracking-widest uppercase text-sm"
                >
                  <Text
                    as="span"
                    className="flex items-center justify-center gap-2 font-medium tracking-wide uppercase text-sm"
                  >
                    <span>{t('product.addToCart')}</span> <span>·</span>{' '}
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.price!}
                      as="span"
                      data-test="price"
                    />
                    <span className="text-[10px] opacity-70 normal-case tracking-normal ml-3 border-l border-white/20 pl-3 hidden sm:inline-block">
                      {t('cart.vatIncluded')}
                    </span>
                    {isOnSale && (
                      <Money
                        withoutTrailingZeros
                        data={selectedVariant?.compareAtPrice!}
                        as="span"
                        className="opacity-50 strike ml-1"
                      />
                    )}
                  </Text>
                </AddToCartButton>
                <BuyNowButton
                  variantId={selectedVariant.id!}
                  quantity={1}
                  className="rounded-none"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(productId);
                  }}
                  className="w-full bg-transparent hover:bg-[#8B8076]/5 border border-[#8B8076]/30 text-[#8B8076] py-3 rounded-none transition-all duration-300 tracking-widest uppercase text-xs font-medium flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(productId) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {isInWishlist(productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedBundleLinks({
  mode,
  products,
}: {
  mode: 'parts' | 'bundles' | 'none';
  products: any[];
}) {
  if (mode === 'none' || products.length === 0) return null;

  const heading =
    mode === 'parts' ? 'Also available individually' : 'Pair it in a bundle';
  const subtitle =
    mode === 'parts'
      ? 'Prefer a single piece? Shop each part of this set on its own.'
      : 'Save more when you carry it together.';

  return (
    <div className="mt-8 border-t border-[#E8E0D8] pt-6">
      <div className="mb-3">
        <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] font-light mb-1">
          {heading}
        </span>
        <p className="text-xs text-[#8B8076] italic font-light">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => {
          const img = p.images?.nodes?.[0];
          return (
            <Link
              key={p.id}
              to={`/products/${p.handle}`}
              prefetch="intent"
              className="group flex items-center gap-3 p-2 border border-[#E8E0D8] rounded-md hover:border-[#a87441] transition-colors"
            >
              <div className="relative w-14 h-14 flex-shrink-0 bg-[#F5F1ED] rounded overflow-hidden flex items-center justify-center">
                {img ? (
                  <img
                    src={img.url}
                    alt={img.altText || p.title}
                    className="w-full h-full object-contain p-1"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-serif text-[#2C2419] leading-tight line-clamp-2 group-hover:text-[#a87441] transition-colors">
                  {p.title}
                </p>
                <p className="mt-1 text-[11px] text-[#8B8076]">
                  {parseFloat(p.priceRange.minVariantPrice.amount).toFixed(0)}{' '}
                  {p.priceRange.minVariantPrice.currencyCode}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="w-8 h-8 rounded-full border border-[#8B8076]/20 relative"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="rounded-full" />}
    </div>
  );
}

function ProductDetail({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  const {t} = useTranslation();
  return (
    <Disclosure
      key={title}
      as="div"
      className="grid w-full gap-2 border-b border-[#8B8076]/20 pb-6 mb-2"
    >
      {({open}) => (
        <>
          <Disclosure.Button className="text-left group">
            <div className="flex justify-between items-center">
              <Text
                size="lead"
                as="h4"
                className="text-[#4A3C31] font-medium text-xs uppercase tracking-[0.2em] group-hover:text-[#a87441] transition-colors"
              >
                {title}
              </Text>
              <IconCaret
                direction={open ? 'up' : 'down'}
                className="text-[#8B8076] w-5 h-5"
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pt-4 grid gap-2'}>
            {typeof content === 'string' ? (
              <div
                className="prose text-[#5C5046]/80 text-sm font-sans leading-loose tracking-wide"
                dangerouslySetInnerHTML={{__html: content}}
              />
            ) : (
              <div className="text-[#5C5046]/80 text-sm font-sans leading-loose tracking-wide">
                {content}
              </div>
            )}
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-[#8B8076]/30 text-[#8B8076] text-xs hover:text-[#4A3C31] hover:border-[#4A3C31] transition-colors uppercase tracking-widest mt-2 inline-block"
                  to={learnMore}
                >
                  {t('general.learnMore')}
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    frameShape: metafield(namespace: "custom", key: "frame_shape") { value }
    gender: metafield(namespace: "custom", key: "gender") { value }
    frameMaterial: metafield(namespace: "custom", key: "frame_material") { value }
    lensDescription: metafield(namespace: "custom", key: "lens_description") { value }
    lensMaterial: metafield(namespace: "custom", key: "lens_material") { value }
    uvProtection: metafield(namespace: "custom", key: "uv_protection") { value }
    frameWidth: metafield(namespace: "custom", key: "frame_width") { value }
    frameHeight: metafield(namespace: "custom", key: "frame_height") { value }
    lensWidth: metafield(namespace: "custom", key: "lens_width") { value }
    noseBridge: metafield(namespace: "custom", key: "nose_bridge") { value }
    templeLength: metafield(namespace: "custom", key: "temple_length") { value }
    productCode: metafield(namespace: "custom", key: "product_code") { value }
    warranty: metafield(namespace: "custom", key: "warranty") { value }
    polarised: metafield(namespace: "custom", key: "polarised") { value }
    measurementImage: metafield(namespace: "custom", key: "measurement_image") {
      reference {
        ... on MediaImage {
          image {
            url
          }
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    media(first: 7) {
      nodes {
        ...Media
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

const RELATED_BUNDLES_QUERY = `#graphql
  query RelatedBundles(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * Resolves cross-links between bundle products and their individual parts.
 * - If the current product's title contains "+", returns `mode: 'parts'` with
 *   the individual products matched by name.
 * - Otherwise returns `mode: 'bundles'` with bundles that include this product.
 */
async function getRelatedBundles(
  storefront: Storefront,
  productId: string,
  productTitle: string,
) {
  if (!productTitle) return {mode: 'none' as const, products: []};

  let allProducts: any[] = [];
  try {
    const result = await storefront.query(RELATED_BUNDLES_QUERY, {
      variables: {first: 100},
    });
    allProducts = result?.products?.nodes || [];
  } catch {
    return {mode: 'none' as const, products: []};
  }

  const isBundle = productTitle.includes('+');

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/\(bundle\)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

  if (isBundle) {
    // Split title on "+", strip "(Bundle)" suffix, resolve each part to a product
    const parts = productTitle
      .replace(/\(bundle\)/gi, '')
      .split('+')
      .map((s) => normalize(s))
      .filter(Boolean);

    const matched: any[] = [];
    for (const part of parts) {
      const hit = allProducts.find((p) => {
        if (!p?.title || p.id === productId) return false;
        if (p.title.includes('+')) return false;
        return normalize(p.title) === part || normalize(p.title).includes(part);
      });
      if (hit && !matched.find((m) => m.id === hit.id)) matched.push(hit);
    }

    return {mode: 'parts' as const, products: matched};
  }

  // Find bundles whose title contains this product's title (loose match on any token)
  const tokens = normalize(productTitle)
    .split(' ')
    .filter((t) => t.length > 2);

  const bundles = allProducts.filter((p) => {
    if (!p?.title || p.id === productId) return false;
    if (!p.title.includes('+')) return false;
    const t = normalize(p.title);
    // require at least 2 tokens overlap to be considered a real pairing
    const overlap = tokens.filter((tok) => t.includes(tok)).length;
    return overlap >= Math.min(2, tokens.length);
  });

  return {mode: 'bundles' as const, products: bundles.slice(0, 4)};
}

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center min-h-[50vh]">
      <h1 className="font-serif text-3xl md:text-4xl text-[#4A3C31] mb-4">
        {is404 ? 'Product Not Found' : 'Something went wrong'}
      </h1>
      <p className="text-[#8B8076] mb-8 max-w-md">
        {is404
          ? "We couldn't find the product you're looking for. It may have been removed or is no longer available."
          : 'There was an error loading this product. Please try again.'}
      </p>
      <RemixLink
        to="/collections/all"
        className="inline-block bg-[#a87441] text-white text-xs uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#8B5E34] transition-colors"
      >
        Browse Products
      </RemixLink>
    </div>
  );
}
