import clsx from 'clsx';
import {useEffect, useId, useMemo} from 'react';
import {useFetcher} from '@remix-run/react';
import {motion, useReducedMotion, type Variants} from 'framer-motion';
import type {
  Product,
  ProductSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

import {Heading, Text} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {Skeleton} from '~/components/Skeleton';
import {usePrefixPathWithLocale} from '~/lib/utils';

interface FeaturedProductsProps {
  count: number;
  heading: string;
  layout?: 'drawer' | 'page';
  onClose?: () => void;
  query?: string;
  reverse?: boolean;
  sortKey: ProductSortKeys;
}

// Animation variants
const containerVariants: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const headerVariants: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Display a grid of products and a heading based on some options.
 * This components uses the storefront API products query
 * @param count number of products to display
 * @param query a filtering query
 * @param reverse wether to reverse the product results
 * @param sortKey Sort the underlying list by the given key.
 * @see query https://shopify.dev/api/storefront/current/queries/products
 * @see filters https://shopify.dev/api/storefront/current/queries/products#argument-products-query
 */
export function FeaturedProducts({
  count = 4,
  heading = 'Shop Best Sellers',
  layout = 'drawer',
  onClose,
  query,
  reverse,
  sortKey = 'BEST_SELLING',
}: FeaturedProductsProps) {
  const {load, data} = useFetcher<{products: Product[]}>();
  const shouldReduceMotion = useReducedMotion();
  const queryString = useMemo(
    () =>
      Object.entries({count, sortKey, query, reverse})
        .map(([key, val]) => (val ? `${key}=${val}` : null))
        .filter(Boolean)
        .join('&'),
    [count, sortKey, query, reverse],
  );
  const productsApiPath = usePrefixPathWithLocale(
    `/api/products?${queryString}`,
  );

  useEffect(() => {
    load(productsApiPath);
  }, [load, productsApiPath]);

  return (
    <>
      <motion.div
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{once: true, margin: '-50px'}}
        variants={headerVariants}
      >
        <Heading format size="copy" className="t-4">
          {heading.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: i * 0.02, duration: 0.3}}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </Heading>
      </motion.div>

      <motion.div
        className={clsx([
          `grid grid-cols-2 gap-x-6 gap-y-8`,
          layout === 'page' ? 'md:grid-cols-4 sm:grid-col-4' : '',
        ])}
        variants={containerVariants}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{once: true, margin: '-50px'}}
      >
        <FeatureProductsContent
          count={count}
          products={data?.products}
          shouldReduceMotion={shouldReduceMotion}
        />
      </motion.div>
    </>
  );
}

/**
 * Render the FeaturedProducts content based on the fetcher's state. "loading", "empty" or "products"
 */
function FeatureProductsContent({
  count = 4,
  products,
  shouldReduceMotion,
}: {
  count: FeaturedProductsProps['count'];
  products: Product[] | undefined;
  shouldReduceMotion: boolean | null;
}) {
  const id = useId();

  if (!products) {
    return (
      <>
        {[...new Array(count)].map((_, i) => (
          <motion.div
            key={`${id + i}`}
            className="grid gap-2"
            variants={shouldReduceMotion ? undefined : itemVariants}
          >
            <EnhancedSkeleton className="aspect-[3/4]" />
            <EnhancedSkeleton className="w-32 h-4" />
          </motion.div>
        ))}
      </>
    );
  }

  if (products?.length === 0) {
    return <Text format>No products found.</Text>;
  }

  return (
    <>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          variants={shouldReduceMotion ? undefined : itemVariants}
          custom={index}
        >
          <ProductCard product={product as any} index={index} />
        </motion.div>
      ))}
    </>
  );
}

/**
 * Enhanced Skeleton with shimmer animation
 */
function EnhancedSkeleton({className}: {className?: string}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-surface ${className}`}
    >
      <div className="absolute inset-0 luxury-skeleton" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{x: ['-100%', '100%']}}
        transition={{duration: 1.5, repeat: Infinity, ease: 'linear'}}
      />
    </div>
  );
}
