import {useState, useEffect, useRef, useCallback} from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import {Link, useFetcher} from '@remix-run/react';
import {Money, CartForm} from '@shopify/hydrogen';

import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';

import {BundlePricing} from './BundlePricing';

// ============================================================================
// PREMIUM ICONS
// ============================================================================
const Icons = {
  Heart: ({
    filled = false,
    className = '',
  }: {
    filled?: boolean;
    className?: string;
  }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <motion.path
        d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={filled ? {scale: [1, 1.2, 1]} : {scale: 1}}
      />
    </svg>
  ),
  ChevronLeft: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronRight: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Bag: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M6 6h12l1 15H5L6 6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6V5a3 3 0 0 1 6 0v1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Sparkles: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    </svg>
  ),
  Tag: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Eye: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Check: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline
        points="20 6 9 17 4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Loading: ({className = ''}: {className?: string}) => (
    <svg
      className={`${className} animate-spin`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.42 31.42"
        strokeDashoffset="10"
      />
    </svg>
  ),
  ArrowRight: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

interface ProductCardProps {
  product: {
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
    tags?: string[];
    vendor?: string;
    availableForSale?: boolean;
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
      };
    };
    variants?: {
      nodes: Array<{
        id: string;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      }>;
    };
  };
  quickAdd?: boolean;
  index?: number;
}

/**
 * ProductCard – Polished luxury product card with rich micro-interactions
 */
export function ProductCard({
  product,
  quickAdd = true,
  index = 0,
}: ProductCardProps) {
  const {toggleWishlist, isInWishlist} = useUI();
  const {isRTL, t} = useTranslation();
  const fetcher = useFetcher<{error?: string}>();
  const shouldReduceMotion = useReducedMotion();

  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  // Mouse tracking for 3D tilt effect (disabled when reduced motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 300,
    damping: 30,
  });

  const images = product.images?.nodes || [];
  const hasMultipleImages = images.length > 1;
  const isWishlisted = isInWishlist(product.id);
  const isNew = product.tags?.includes('new') || false;
  const isSale = product.tags?.includes('sale') || false;
  const hasPrice =
    parseFloat(product.priceRange?.minVariantPrice?.amount || '0') > 0;
  const isAvailable = product.availableForSale !== false;

  // Extract iPhone models from tags (e.g., "iphone-17-pro", "iphone-17-pro-max")
  const iPhoneModels =
    product.tags
      ?.filter((tag) => tag.toLowerCase().startsWith('iphone-'))
      ?.map((tag) => {
        const match = tag.match(/iphone-?(\d+)-?(pro-?max|pro|max|plus|mini)/i);
        if (match) {
          const [, number, model] = match;
          return `iPhone ${number} ${model
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())}`;
        }
        // Simple fallback for tags like "iphone-17-pro"
        return tag
          .replace(/iphone-?/i, 'iPhone ')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }) || [];

  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Parse title: "The Olive - Mocha Tort" → name: "The Olive", color: "Mocha Tort"
  const titleParts = product.title.split(' - ');
  const productName = titleParts[0]?.trim() || product.title;
  const colorFromTitle =
    titleParts.length > 1 ? titleParts.slice(1).join(' - ').trim() : '';
  const colorFromVariant = product.variants?.nodes?.[0]?.selectedOptions?.find(
    (opt) => opt.name.toLowerCase() === 'color',
  )?.value;
  const productColor = colorFromTitle || colorFromVariant || '';

  // Calculate discount
  const hasDiscount =
    product.compareAtPriceRange?.minVariantPrice?.amount &&
    product.priceRange?.minVariantPrice?.amount &&
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
      parseFloat(product.priceRange.minVariantPrice.amount);

  // 3D tilt effect handler (skip when reduced motion)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
    stopSlideshow();
    setCurrentImage(0);
  };

  // Auto-slideshow
  const startSlideshow = useCallback(() => {
    if (!hasMultipleImages || slideshowRef.current) return;
    slideshowRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 1800);
  }, [hasMultipleImages, images.length]);

  const stopSlideshow = useCallback(() => {
    if (slideshowRef.current) {
      clearInterval(slideshowRef.current);
      slideshowRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopSlideshow();
  }, [stopSlideshow]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    startSlideshow();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants?.nodes?.[0];
    if (!variant?.id || isAdding) return;

    setIsAdding(true);
    fetcher.submit(
      {
        cartAction: CartForm.ACTIONS.LinesAdd,
        cartFormInput: JSON.stringify({
          lines: [{merchandiseId: variant.id, quantity: 1}],
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  };

  // Drive UI state from fetcher, not arbitrary timeouts
  useEffect(() => {
    if (fetcher.state === 'idle' && isAdding) {
      setIsAdding(false);
      if (!fetcher.data?.error) {
        setShowAdded(true);
        const t = setTimeout(() => setShowAdded(false), 2000);
        return () => clearTimeout(t);
      }
    }
  }, [fetcher.state, fetcher.data, isAdding]);

  return (
    <motion.div
      className="group relative"
      style={{direction: isRTL ? 'rtl' : 'ltr'}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      initial={{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        {/* Image Container with 3D Tilt */}
        <motion.div
className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#F9F9F9] to-warm mb-4 shadow-sm border border-[#EAE4DC] group-hover:shadow-xl transition-shadow duration-700"
          style={
            shouldReduceMotion
              ? undefined
              : {
                  rotateX: isHovered ? rotateX : 0,
                  rotateY: isHovered ? rotateY : 0,
                  transformPerspective: 1000,
                }
          }
        >
          {/* Premium Shimmer Effect */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{x: '-100%', opacity: 0}}
                animate={{x: '100%', opacity: [0, 0.15, 0]}}
                exit={{opacity: 0}}
                transition={{duration: 1, ease: 'easeInOut'}}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Product Image with smooth crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{opacity: 0, scale: 1.05}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
              className="absolute inset-0 w-full h-full"
            >
              {images.length > 0 && images[currentImage]?.url ? (
                <img
                  src={images[currentImage].url}
                  alt={images[currentImage].altText || product.title}
                  className="w-full h-full object-contain object-center p-3 md:p-5 drop-shadow-sm transition-transform duration-700 ease-out group-hover:scale-105"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#EDE8E3] flex items-center justify-center">
                  <span className="text-[#AA9B8F]/40 text-[10px] font-light tracking-[0.2em] uppercase">
                    {product.title}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

          {/* Sold Out Overlay */}
          {!isAvailable && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <motion.span
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  className="font-serif text-xl italic text-white/90 tracking-wide"
                >
                  {t('product.soldOut', 'Sold Out')}
                </motion.span>
              </div>
            )}

          {/* New Badge with animation */}
          <AnimatePresence>
            {isNew && (
              <motion.span
                initial={{opacity: 0, x: -20, scale: 0.8}}
                animate={{opacity: 1, x: 0, scale: 1}}
                exit={{opacity: 0, x: -20}}
className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-bronze to-bronze-dark text-white text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg z-20"
              >
                <Icons.Sparkles />
                {t('product.new', 'New')}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Sale Badge */}
          {isSale && !isNew && (
            <motion.span
              initial={{opacity: 0, scale: 0.8}}
              animate={{opacity: 1, scale: 1}}
              className="absolute top-3 left-3 px-3 py-1.5 bg-red-500/90 text-white text-xs uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg z-20"
            >
              <Icons.Tag />
              {t('product.sale', 'Sale')}
            </motion.span>
          )}

          {/* Wishlist Button with heart animation - Always visible on touch devices */}
          <motion.button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-12 h-12 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 z-30 shadow-md touch-target ${
              isWishlisted
? 'bg-bronze text-white'
: 'bg-white/95 text-brand-text opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-bronze hover:text-white backdrop-blur-sm'
            }`}
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.9}}
            aria-label={
              isWishlisted
                ? t('product.removeFromWishlist')
                : t('product.addToWishlist')
            }
          >
            <Icons.Heart filled={isWishlisted} />
          </motion.button>

          {/* Image Navigation Arrows */}
          <AnimatePresence>
            {hasMultipleImages && isHovered && (
              <>
                <motion.button
                  initial={{opacity: 0, x: -10}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: -10}}
                  transition={{duration: 0.2}}
                  onClick={prevImage}
className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/90 text-brand-text flex items-center justify-center backdrop-blur-sm hover:bg-bronze hover:text-white transition-colors z-20 shadow-md touch-target"
                  aria-label={t('product.prevImage', 'Previous image')}
                >
                  <Icons.ChevronLeft />
                </motion.button>
                <motion.button
                  initial={{opacity: 0, x: 10}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: 10}}
                  transition={{duration: 0.2}}
                  onClick={nextImage}
className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/90 text-brand-text flex items-center justify-center backdrop-blur-sm hover:bg-bronze hover:text-white transition-colors z-20 shadow-md touch-target"
                  aria-label={t('product.nextImage', 'Next image')}
                >
                  <Icons.ChevronRight />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Image Dots Indicator */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.slice(0, 5).map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImage(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImage
? 'bg-bronze w-5'
                      : 'bg-white/70 w-1.5 hover:bg-white'
                  }`}
                  whileHover={{scale: 1.2}}
                  aria-label={`${t('product.goToImage', 'Go to image')} ${
                    idx + 1
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick Add Button */}
          <AnimatePresence>
            {quickAdd && isAvailable && hasPrice && (
              <motion.button
                initial={{opacity: 0, y: 20}}
                animate={{opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20}}
                exit={{opacity: 0, y: 20}}
                transition={{duration: 0.3, ease: [0.25, 0.1, 0.25, 1]}}
                onClick={handleQuickAdd}
                disabled={isAdding}
                className={`absolute bottom-3 left-3 right-3 py-3.5 md:py-3 min-h-[48px] rounded-lg font-medium text-xs md:text-[11px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md z-20 shadow-lg touch-target ${
                  showAdded
                    ? 'bg-green-600 text-white'
: 'bg-bronze/95 hover:bg-bronze-dark text-white'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.span
                      key="loading"
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                      className="flex items-center gap-2"
                    >
                      <Icons.Loading />
                      Adding...
                    </motion.span>
                  ) : showAdded ? (
                    <motion.span
                      key="added"
                      initial={{opacity: 0, scale: 0.8}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0}}
                      className="flex items-center gap-2"
                    >
                      <Icons.Check />
                      Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                      className="flex items-center gap-2"
                    >
                      <Icons.Bag />
                      {t('product.quickAdd', 'Quick Add')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product Info */}
        <div className="space-y-1 mt-4">
          {/* 1. Designer name */}
<div className="text-xs uppercase tracking-[0.15em] text-bronze font-medium leading-none">
            {product.vendor || 'Formé Haus'}
          </div>

          {/* 2. Product name */}
<h3 className="font-serif text-warm text-sm md:text-base leading-snug group-hover:text-bronze transition-colors duration-300 line-clamp-1 tracking-wide mt-1">
            {productName}
          </h3>

          {/* 3. Color */}
          {productColor ? (
            <p className="text-xs md:text-sm text-[#8B8076] tracking-wide line-clamp-1 min-h-[1.25rem]">
              {productColor}
            </p>
          ) : (
            <div className="min-h-[1.25rem]" />
          )}

          {/* 4. Price */}
<div className="flex items-baseline gap-2 pt-0.5 mt-2 border-t border-bronze/10">
            {hasPrice ? (
              <>
<p className="text-warm text-sm font-medium transition-all duration-300 group-hover:text-bronze flex items-baseline mt-1">
                  <Money
                    data={product.priceRange.minVariantPrice as any}
                    withoutTrailingZeros
                  />
                </p>
                {isAvailable && (
                  <span className="text-xs text-[#8B8076] font-normal tracking-wide mt-1">
                    SAR (VAT included)
                  </span>
                )}
                {hasDiscount && (
                  <p className="text-[#8B8076] text-xs line-through mt-1 ml-auto">
                    <Money
                      data={product.compareAtPriceRange!.minVariantPrice}
                      withoutTrailingZeros
                    />
                  </p>
                )}
              </>
            ) : (
              <p className="text-[13px] text-[#8B8076] italic mt-1">
                Price TBA
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Hover indicator line */}
      <motion.div
className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-bronze to-bronze-light rounded-full"
        initial={{width: 0}}
        animate={{width: isHovered ? '40%' : 0}}
        transition={{duration: 0.4, ease: [0.25, 0.1, 0.25, 1]}}
      />
    </motion.div>
  );
}

export default ProductCard;

export function ProductCardSkeleton({index = 0}: {index?: number}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: index * 0.08}}
      style={{animationDelay: `${index * 80}ms`}}
    >
<div className="relative aspect-square overflow-hidden rounded-xl bg-surface mb-4">
        <div className="absolute inset-0 luxury-skeleton" />
      </div>
      <div className="space-y-1.5 px-1 mt-4">
<div className="h-4 w-3/4 rounded bg-surface luxury-skeleton" />
<div className="h-3 w-1/2 rounded bg-surface luxury-skeleton mt-1" />
<div className="h-3.5 w-1/3 rounded bg-surface luxury-skeleton mt-1" />
      </div>
    </motion.div>
  );
}
