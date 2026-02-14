import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { useUI } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

// Icons
const Icons = {
  Heart: ({ filled = false, className = '' }: { filled?: boolean; className?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Bag: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        altText: string;
      }>;
    };
    tags?: string[];
    availableForSale?: boolean;
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
      };
    };
  };
  quickAdd?: boolean;
  index?: number;
}

/**
 * ProductCard - Polished luxury product card
 * 
 * Features:
 * - Smooth 3D tilt effect with spring physics
 * - Shimmer effect on hover
 * - Animated image transitions
 * - Elegant wishlist button with heart animation
 * - Price comparison display
 * - Staggered entrance animations
 */
export function ProductCard({ product, quickAdd = true, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useUI();
  const { isRTL, t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTilted, setIsTilted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const images = product.images?.nodes || [];
  const hasMultipleImages = images.length > 1;
  const isWishlisted = isInWishlist(product.id);
  const isNew = product.tags?.includes('new') || false;
  const isSale = product.tags?.includes('sale') || false;

  // Calculate discount if compareAtPrice exists
  const hasDiscount = product.compareAtPriceRange?.minVariantPrice?.amount &&
    product.priceRange?.minVariantPrice?.amount &&
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount);

  // 3D Tilt effect with smooth spring
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isTilted) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setIsTilted(true), 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsTilted(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
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
      ref={cardRef}
      className="group relative"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#1A1A1A] mb-4 shadow-lg shadow-black/20">
          {/* Shimmer Effect */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '100%', opacity: [0, 0.3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Product Image with smooth transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {images.length > 0 ? (
                <Image
                  data={{
                    url: images[currentImage].url,
                    altText: images[currentImage].altText || product.title,
                  }}
                  className="w-full h-full object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center">
                  <span className="text-[#AA9B8F] text-sm font-light tracking-wider">No image</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {/* New Badge */}
          {isNew && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
            animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-lg ${isWishlisted
              ? 'bg-[#a87441] text-white'
              : 'bg-[#121212]/60 text-[#F0EAE6] opacity-0 group-hover:opacity-100 hover:bg-[#a87441] backdrop-blur-sm'
              }`}
            aria-label={isWishlisted ? t('product.removeFromWishlist') : t('product.addToWishlist')}
          >
            <Icons.Heart
              filled={isWishlisted}
              className={`transition-all duration-300 ${isWishlisted ? 'scale-110' : ''}`}
            />
          </motion.button>

          {/* Image Navigation Arrows */}
          <AnimatePresence>
            {hasMultipleImages && isHovered && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#121212]/70 text-[#F0EAE6] flex items-center justify-center backdrop-blur-sm hover:bg-[#a87441] transition-colors z-20 shadow-lg"
                  aria-label={t('product.prevImage', 'Previous image')}
                >
                  <Icons.ChevronLeft />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#121212]/70 text-[#F0EAE6] flex items-center justify-center backdrop-blur-sm hover:bg-[#a87441] transition-colors z-20 shadow-lg"
                  aria-label={t('product.nextImage', 'Next image')}
                >
                  <Icons.ChevronRight />
                </motion.button>

                {/* Image Dots */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20"
                >
                  {images.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImage(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImage
                        ? 'bg-[#a87441] w-6'
                        : 'bg-white/50 w-1.5 hover:bg-white/80'
                        }`}
                      aria-label={`${t('product.goToImage', 'Go to image')} ${idx + 1}`}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Quick Add Button */}
          {quickAdd && product.availableForSale !== false && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute bottom-4 left-4 right-4 bg-[#a87441] hover:bg-[#8B5E3C] text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl z-20"
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
        <div className="space-y-2">
          <h3 className="font-serif text-[#F0EAE6] text-[15px] leading-snug group-hover:text-[#a87441] transition-all duration-300 line-clamp-2 group-hover:tracking-wide">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-[#F0EAE6] font-medium transition-all duration-300 group-hover:text-[#D4AF87]">
              {product.priceRange?.minVariantPrice ? (
                <Money data={product.priceRange.minVariantPrice} />
              ) : (
                <span className="text-sm">Price unavailable</span>
              )}
            </p>
            {hasDiscount && (
              <p className="text-[#AA9B8F] text-sm line-through opacity-70">
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
