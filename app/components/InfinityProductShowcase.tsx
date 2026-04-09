import {useRef, useEffect, useState, useMemo} from 'react';
import {motion} from 'framer-motion';
import {Link} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';

import {useTranslation} from '~/hooks/useTranslation';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    nodes: Array<{
      url: string;
      altText?: string | null;
    }>;
  };
  availableForSale?: boolean;
}

interface InfinityProductShowcaseProps {
  products: ShopifyProduct[];
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function ProductCard({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) {
  const imageUrl = product.images?.nodes?.[0]?.url;
  const imageAlt = product.images?.nodes?.[0]?.altText || product.title;
  const price = product.priceRange?.minVariantPrice;
  const hasPrice = price && parseFloat(price.amount) > 0;

  return (
    <motion.div
      className="flex-shrink-0 w-[200px] md:w-[240px] lg:w-[280px] px-2"
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{delay: index * 0.03, duration: 0.5}}
    >
      <Link to={`/products/${product.handle}`} className="group block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F5F2ED] mb-3">
          <motion.div
            className="absolute inset-0"
            whileHover={{scale: 1.05}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-contain object-center p-4"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E8E4E0] to-[#D4CFC8] flex items-center justify-center">
                <span className="font-serif text-2xl text-[#8B8076]">
                  {product.title.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Price Tag - Bottom */}
          {hasPrice && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-brand-text text-xs font-medium rounded-full">
                <Money data={price as any} />
              </span>
            </div>
          )}

          {/* Border on hover */}
          <div className="absolute inset-0 rounded-xl border-2 border-[#a87441]/0 group-hover:border-[#a87441]/30 transition-colors duration-500" />
        </div>

        {/* Product Info - no truncation */}
        <div className="space-y-1 text-center">
          <h3 className="font-serif text-sm md:text-base text-brand-text group-hover:text-bronze transition-colors duration-300">
            {product.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

export function InfinityProductShowcase({
  products,
}: InfinityProductShowcaseProps) {
  const {t, isRTL} = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Filter to only in-stock products with images
  const validProducts = useMemo(
    () => products.filter((p) => p.images?.nodes?.length > 0),
    [products],
  );

  // Shuffle products randomly
  const shuffledProducts = useMemo(
    () => shuffleArray(validProducts),
    [validProducts],
  );

  const DUPLICATES = 6;

  // Create infinite loop by duplicating products multiple times
  const infiniteProducts = useMemo(() => {
    let result: ShopifyProduct[] = [];
    for (let i = 0; i < DUPLICATES; i++) {
      result = [...result, ...shuffledProducts];
    }
    return result;
  }, [shuffledProducts]);

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || validProducts.length === 0) return;

    let animationId: number;
    let scrollPos = container.scrollLeft;
    const speed = isRTL ? -0.8 : 0.8;
    const singleSetWidth = container.scrollWidth / DUPLICATES;

    const animate = () => {
      if (!isDragging) {
        scrollPos += speed;

        if (isRTL) {
          if (scrollPos <= 0) {
            scrollPos = singleSetWidth * 4;
          }
        } else {
          if (scrollPos >= singleSetWidth * 4) {
            scrollPos = singleSetWidth;
          }
        }

        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };

    if (!isRTL) {
      container.scrollLeft = singleSetWidth;
      scrollPos = singleSetWidth;
    } else {
      container.scrollLeft = singleSetWidth * 4;
      scrollPos = singleSetWidth * 4;
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging, isRTL, validProducts.length]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  if (validProducts.length === 0) return null;

  return (
    <section
      className="py-12 md:py-16 bg-gradient-to-b from-[#F9F5F0] via-[#F5F2ED] to-[#F9F5F0]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-8 md:mb-10">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-text mb-2">
              {t('showcase.collection', 'The Collection')}
            </h2>
            <p className="text-[#8B8076] text-sm md:text-base max-w-md">
              {t('showcase.subtitle', 'Discover all our unique products')}
            </p>
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] text-[#a87441]">
            {`${validProducts.length} ${t('showcase.products', 'Products')}`}
          </span>
        </motion.div>
      </div>

      {/* Infinity Scroll Container */}
      <div className="relative">
        {/* Gradient Masks - Left & Right */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #F9F5F0 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, #F9F5F0 0%, transparent 100%)',
          }}
        />

        {/* Scrolling Track */}
        <div
          ref={scrollRef}
          role="listbox"
          aria-label="Product carousel"
          tabIndex={0}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing py-4"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {infiniteProducts.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              index={index % validProducts.length}
            />
          ))}
        </div>

        {/* Drag Hint */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#AA9B8F]"
          initial={{opacity: 0}}
          animate={{opacity: isDragging ? 0 : 1}}
          transition={{duration: 0.3}}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M9 18l6-6-6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t('showcase.dragToBrowse', 'Drag to browse')}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

export default InfinityProductShowcase;
