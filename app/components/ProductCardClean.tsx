import {useState, useEffect, useRef, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from '@remix-run/react';
import {Money, CartForm} from '@shopify/hydrogen';

import {useTranslation} from '~/hooks/useTranslation';

interface ProductCardCleanProps {
  product: {
    id: string;
    handle: string;
    title: string;
    titleAr?: {value: string} | null;
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
    vendor?: string;
    availableForSale?: boolean;
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
      };
    };
    variants?: {
      nodes: Array<{id: string}>;
    };
  };
  index?: number;
}

/**
 * ProductCardClean - Clean, professional product card for collection pages
 * Designed for light backgrounds with clear price visibility
 */
export function ProductCardClean({product, index = 0}: ProductCardCleanProps) {
  const {isRTL} = useTranslation();

  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const images = product.images?.nodes || [];
  const hasMultipleImages = images.length > 1;
  const hasPrice =
    parseFloat(product.priceRange?.minVariantPrice?.amount || '0') > 0;
  const isAvailable = product.availableForSale !== false;
  const lowStock = (() => {
    const qty: number | undefined = (product as any)?.variants?.nodes?.[0]
      ?.quantityAvailable;
    return typeof qty === 'number' && qty >= 1 && qty <= 5 ? qty : null;
  })();

  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Resolve display title: use Arabic metafield when in RTL/Arabic mode
  const displayTitle =
    isRTL && product.titleAr?.value ? product.titleAr.value : product.title;

  // Parse title for color (color suffix is English-only; skip split in Arabic)
  const titleParts = isRTL ? [displayTitle] : displayTitle.split(' - ');
  const productName = titleParts[0]?.trim() || displayTitle;
  const productColor =
    !isRTL && titleParts.length > 1
      ? titleParts.slice(1).join(' - ').trim()
      : '';

  // Calculate discount
  const hasDiscount =
    product.compareAtPriceRange?.minVariantPrice?.amount &&
    product.priceRange?.minVariantPrice?.amount &&
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
      parseFloat(product.priceRange.minVariantPrice.amount);

  // Auto-slideshow
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
    setCurrentImage(0);
  }, []);

  useEffect(() => () => stopSlideshow(), [stopSlideshow]);

  // Wishlist: localStorage bucket fh_wishlist
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fh_wishlist');
      if (!raw) return;
      const ids: string[] = JSON.parse(raw);
      setIsWishlisted(ids.includes(product.id));
    } catch {}
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const raw = localStorage.getItem('fh_wishlist');
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const next = ids.includes(product.id)
        ? ids.filter((id) => id !== product.id)
        : [...ids, product.id];
      localStorage.setItem('fh_wishlist', JSON.stringify(next));
      setIsWishlisted(next.includes(product.id));
    } catch {}
  };

  return (
    <motion.div
      className="group relative"
      style={{direction: isRTL ? 'rtl' : 'ltr'}}
      onMouseEnter={() => {
        setIsHovered(true);
        startSlideshow();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        stopSlideshow();
      }}
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{
        duration: 0.5,
        delay: (index % 8) * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        {/* Image Container - Clean white background */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F8F6F3] mb-3">
          {/* Wishlist Heart */}
          <button
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? 'Remove from saved' : 'Save product'}
            onClick={toggleWishlist}
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 text-[#4A3C31] hover:bg-white shadow flex items-center justify-center transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          {/* Product Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              className="absolute inset-0 w-full h-full"
            >
              {images.length > 0 && images[currentImage]?.url ? (
                <img
                  src={images[currentImage].url}
                  alt={images[currentImage].altText || product.title}
                  className="w-full h-full object-contain object-center p-4 md:p-6 transition-transform duration-500 ease-out group-hover:scale-105"
                  loading={index < 8 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[#AA9B8F] text-xs uppercase tracking-wider">
                    {product.title}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Image Dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 4).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImage(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImage
                      ? 'bg-[#a87441] w-5'
                      : 'bg-[#4A3C31]/30 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Stock Badges */}
          {lowStock && isAvailable && (
            <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-bronze/10 text-bronze-dark border border-bronze/20 px-3 py-1 text-[11px] font-medium shadow-sm">
              Only {lowStock} left
            </span>
          )}
          {/* Sold Out Badge */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <span className="px-4 py-2 bg-white/90 text-[#4A3C31] text-xs uppercase tracking-wider rounded-full">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick Add Button */}
          {isAvailable && hasPrice && product.variants?.nodes?.[0]?.id && (
            <CartForm
              route="/cart"
              inputs={{
                lines: [
                  {merchandiseId: product.variants.nodes[0].id, quantity: 1},
                ],
              }}
              action={CartForm.ACTIONS.LinesAdd}
            >
              {(fetcher) => (
                <motion.button
                  type="submit"
                  onClick={(e) => e.stopPropagation()}
                  disabled={fetcher.state !== 'idle'}
                  className="absolute bottom-3 left-3 right-3 py-3 min-h-[44px] rounded-lg bg-[#4A3C31]/90 text-white text-[10px] uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 backdrop-blur-sm z-10 shadow-md"
                  animate={{y: isHovered ? 0 : 8, opacity: isHovered ? 1 : 0}}
                  transition={{duration: 0.25, ease: [0.25, 0.1, 0.25, 1]}}
                >
                  {fetcher.state !== 'idle' ? 'Adding...' : 'Quick Add'}
                </motion.button>
              )}
            </CartForm>
          )}
        </div>

        {/* Product Info - Clean layout */}
        <div className="space-y-1 mt-3">
          {/* 1. Designer name */}
          <div className="text-[11px] uppercase tracking-[0.15em] text-[#a87441] font-medium leading-none">
            {product.vendor || 'Formé Haus'}
          </div>

          {/* 2. Product name */}
          <h3 className="font-serif text-[#4A3C31] text-[15px] md:text-[16px] leading-snug group-hover:text-[#a87441] transition-colors line-clamp-1 mt-1">
            {productName}
          </h3>

          {/* 3. Color */}
          {productColor ? (
            <p className="text-[13px] text-[#8B8076] h-[19px] line-clamp-1">
              {productColor}
            </p>
          ) : (
            <div className="h-[19px]" />
          )}

          {/* 4. Price Row */}
          <div className="flex items-baseline gap-2 pt-1 border-t border-[#4A3C31]/5 mt-2">
            {hasPrice ? (
              <>
                <p className="text-[14px] font-medium text-[#4A3C31] flex items-baseline">
                  <Money
                    data={product.priceRange.minVariantPrice as any}
                    withoutTrailingZeros
                  />
                </p>
                {isAvailable && (
                  <span className="text-[11px] text-[#8B8076] font-normal tracking-wide ml-1">
                    SAR (VAT included)
                  </span>
                )}
                {hasDiscount && (
                  <p className="text-[12px] text-[#8B8076] line-through ml-auto">
                    <Money
                      data={product.compareAtPriceRange!.minVariantPrice}
                      withoutTrailingZeros
                    />
                  </p>
                )}
              </>
            ) : (
              <p className="text-[13px] text-[#8B8076] italic">Price TBA</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCardClean;
