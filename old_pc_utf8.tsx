import {useState, useEffect, useRef, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';

// Icons
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
      <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Bag: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 6h12l1 15H5L6 6z" />
      <path d="M9 6V5a3 3 0 0 1 6 0v1" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
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
 * ProductCard - Polished luxury product card
 */
export function ProductCard({
  product,
  quickAdd = true,
  index = 0,
}: ProductCardProps) {
  const {toggleWishlist, isInWishlist} = useUI();
  const {isRTL, t} = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images?.nodes || [];
  const hasMultipleImages = images.length > 1;
  const isWishlisted = isInWishlist(product.id);
  const isNew = product.tags?.includes('new') || false;
  const isSale = product.tags?.includes('sale') || false;

  // Parse title: "The Olive - Mocha Tort" ΓåÆ name: "The Olive", color: "Mocha Tort"
  const titleParts = product.title.split(' - ');
  const productName = titleParts[0]?.trim() || product.title;
  const colorFromTitle = titleParts.length > 1 ? titleParts.slice(1).join(' - ').trim() : '';
  // Fallback: check variant selectedOptions for "Color"
  const colorFromVariant = product.variants?.nodes?.[0]?.selectedOptions?.find(
    (opt) => opt.name.toLowerCase() === 'color',
  )?.value;
  const productColor = colorFromTitle || colorFromVariant || '';
  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate discount if compareAtPrice exists
  const hasDiscount =
    product.compareAtPriceRange?.minVariantPrice?.amount &&
    product.priceRange?.minVariantPrice?.amount &&
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
      parseFloat(product.priceRange.minVariantPrice.amount);

  // Auto-slideshow: cycle images every 2s while hovered
  const startSlideshow = useCallback(() => {
    if (!hasMultipleImages || slideshowRef.current) return;
    slideshowRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);
  }, [hasMultipleImages, images.length]);

  const stopSlideshow = useCallback(() => {
    if (slideshowRef.current) {
      clearInterval(slideshowRef.current);
      slideshowRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSlideshow();
  }, [stopSlideshow]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    startSlideshow();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopSlideshow();
    setCurrentImage(0);
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

  return (
    <motion.div
      className="group relative"
      style={{direction: isRTL ? 'rtl' : 'ltr'}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      whileHover={{y: -3}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#FAF8F5] mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-700">
          {/* Shimmer Effect */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{x: '-100%', opacity: 0}}
                animate={{x: '100%', opacity: [0, 0.3, 0]}}
                exit={{opacity: 0}}
                transition={{duration: 0.8, ease: 'easeInOut'}}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Product Image with smooth transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.4, ease: 'easeOut'}}
              className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            >
              {images.length > 0 ? (
                <Image
                  data={{
                    url: images[currentImage].url,
                    altText: images[currentImage].altText || product.title,
                    width: 600,
                    height: 800,
                  }}
                  className="w-full h-full object-contain object-center p-3 md:p-6 drop-shadow-sm"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  loading={index < 4 ? 'eager' : 'lazy'}
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

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

          {/* Coming Soon Overlay - only for products without a valid price */}
          {!product.availableForSale && !product.priceRange?.minVariantPrice?.amount && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="font-serif text-xl italic text-white/90 tracking-wide">
                {t('product.comingSoon', 'Coming Soon')}
              </span>
            </div>
          )}

          {/* New Badge */}
          {isNew && (
            <motion.span
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              className="absolute top-3 left-3 px-3 py-1.5 bg-[#a87441] text-white text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg z-20"
            >
              <Icons.Sparkles />
              {t('product.new', 'New')}
            </motion.span>
          )}

          {/* Sale Badge */}
          {isSale && !isNew && (
            <span className="absolute top-3 left-3 px-3 py-1.5 bg-red-600/90 text-white text-[10px] uppercase tracking-widest rounded-full shadow-lg z-20">
              {t('product.sale', 'Sale')}
            </span>
          )}

          {/* Wishlist Button with heart animation */}
          <motion.button
            onClick={handleWishlist}
            initial={false}
            animate={isWishlisted ? {scale: [1, 1.2, 1]} : {}}
            transition={{duration: 0.3}}
            className={`absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-md ${
              isWishlisted
                ? 'bg-[#a87441] text-white'
                : 'bg-white/90 text-[#4A3C31] opacity-60 group-hover:opacity-100 hover:bg-[#a87441] hover:text-white backdrop-blur-sm'
            }`}
            aria-label={
              isWishlisted
                ? t('product.removeFromWishlist')
                : t('product.addToWishlist')
            }
          >
            <Icons.Heart
              filled={isWishlisted}
              className={`transition-all duration-300 ${
                isWishlisted ? 'scale-110' : ''
              }`}
            />
          </motion.button>

          {/* Image Navigation Arrows (hover-only on desktop) */}
          <AnimatePresence>
            {hasMultipleImages && isHovered && (
              <>
                <motion.button
                  initial={{opacity: 0, x: -10}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: -10}}
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-[#4A3C31] flex items-center justify-center backdrop-blur-sm hover:bg-[#a87441] hover:text-white transition-colors z-20 shadow-md"
                  aria-label={t('product.prevImage', 'Previous image')}
                >
                  <Icons.ChevronLeft />
                </motion.button>
                <motion.button
                  initial={{opacity: 0, x: 10}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: 10}}
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-[#4A3C31] flex items-center justify-center backdrop-blur-sm hover:bg-[#a87441] hover:text-white transition-colors z-20 shadow-md"
                  aria-label={t('product.nextImage', 'Next image')}
                >
                  <Icons.ChevronRight />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Image Dots (always visible for mobile discoverability) */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImage(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImage
                      ? 'bg-[#a87441] w-6'
                      : 'bg-white/50 w-1.5 hover:bg-white/80'
                  }`}
                  aria-label={`${t('product.goToImage', 'Go to image')} ${
                    idx + 1
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick Add Button */}
          {quickAdd && product.availableForSale !== false && (
            <motion.button
              initial={{opacity: 0, y: 12}}
              animate={{opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 12}}
              transition={{duration: 0.3, ease: [0.25, 0.1, 0.25, 1]}}
              className="absolute bottom-4 left-4 right-4 bg-[#a87441]/95 hover:bg-[#8B5E3C] text-white py-3 rounded-md font-medium text-[12px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors duration-300 backdrop-blur-sm z-20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Icons.Bag />
              {t('product.quickAdd', 'Quick Add')}
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5 px-1 mt-4">
          {/* Line 1: Product Name */}
          <h3 className="font-serif text-current text-[15px] md:text-[17px] leading-snug group-hover:text-[#a87441] transition-all duration-300 line-clamp-1 tracking-wide">
            {productName}
          </h3>
          {/* Line 2: Color */}
          {productColor && (
            <p className="text-[12px] text-[#8B8076] tracking-wide line-clamp-1">
              {productColor}
            </p>
          )}
          {/* Line 3: Price */}
          <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
            <p className="text-current text-[14px] font-semibold transition-all duration-300 group-hover:text-[#a87441]">
              {product.priceRange?.minVariantPrice ? (
                <span className="flex items-baseline gap-1.5">
                  <Money data={product.priceRange.minVariantPrice as any} />
                  {product.availableForSale !== false && (
                    <span className="text-[10px] opacity-60 font-normal lowercase tracking-wide">
                      {t('cart.vatIncluded', '(vat included)')}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-sm opacity-50">Price unavailable</span>
              )}
            </p>
            {hasDiscount && (
              <p className="opacity-50 text-[12px] line-through">
                <Money data={product.compareAtPriceRange!.minVariantPrice} />
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
