import {useState, useEffect, useRef, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link, useFetcher} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';

interface ProductCardCleanProps {
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
    availableForSale?: boolean;
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
      };
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
  const images = product.images?.nodes || [];
  const hasMultipleImages = images.length > 1;

  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Parse title for color
  const titleParts = product.title.split(' - ');
  const productName = titleParts[0]?.trim() || product.title;
  const productColor =
    titleParts.length > 1 ? titleParts.slice(1).join(' - ').trim() : '';

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
                  className={`h-1 rounded-full transition-all ${
                    idx === currentImage
                      ? 'bg-[#a87441] w-4'
                      : 'bg-[#4A3C31]/30 w-1'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Coming Soon Badge */}
          {!product.availableForSale && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <span className="px-4 py-2 bg-white/90 text-[#4A3C31] text-xs uppercase tracking-wider rounded-full">
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Product Info - Clean layout */}
        <div className="space-y-1">
          {/* Product Name */}
          <h3 className="text-[15px] text-[#4A3C31] font-medium leading-snug group-hover:text-[#a87441] transition-colors line-clamp-1">
            {productName}
          </h3>

          {/* Color */}
          {productColor && (
            <p className="text-[13px] text-[#8B8076]">{productColor}</p>
          )}

          {/* Price Row */}
          <div className="flex items-center gap-2 pt-0.5">
            <p className="text-[15px] font-semibold text-[#4A3C31]">
              {product.priceRange?.minVariantPrice ? (
                <Money data={product.priceRange.minVariantPrice as any} />
              ) : (
                <span className="text-sm text-[#8B8076]">
                  Price unavailable
                </span>
              )}
            </p>

            {hasDiscount && (
              <p className="text-[13px] text-[#8B8076] line-through">
                <Money data={product.compareAtPriceRange!.minVariantPrice} />
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCardClean;
