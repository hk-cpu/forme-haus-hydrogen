import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { useUI } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';
import TiltedCard from '~/components/TiltedCard';

// Icons
const Icons = {
  Heart: ({ filled = false, className = '' }: { filled?: boolean; className?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" />
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
        currencyCode: string;
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
 * - Smooth 3D tilt effect with spring physics (now handled by TiltedCard)
 * - Shimmer effect on hover (removed, can be re-added to OverlayContent if needed)
 * - Animated image transitions (removed, TiltedCard shows one image)
 * - Elegant wishlist button with heart animation
 * - Price comparison display
 * - Staggered entrance animations
 */
export function ProductCard({ product, quickAdd = true, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useUI();
  const { isRTL, t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0); // Kept for potential future use or if TiltedCard supports multiple images

  const images = product.images?.nodes || [];
  const isWishlisted = isInWishlist(product.id);
  const isNew = product.tags?.includes('new') || false;
  const isSale = product.tags?.includes('sale') || false;

  // Calculate discount if compareAtPrice exists
  const hasDiscount = product.compareAtPriceRange?.minVariantPrice?.amount &&
    product.priceRange?.minVariantPrice?.amount &&
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const OverlayContent = () => (
    <>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10" />

      {/* New Badge */}
      {isNew && (
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-[#a87441] text-white text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg z-20">
          <Icons.Sparkles />
          {t('product.new', 'New')}
        </div>
      )}

      {/* Sale Badge */}
      {isSale && !isNew && (
        <span className="absolute top-3 left-3 px-3 py-1.5 bg-red-600/90 text-white text-[10px] uppercase tracking-widest rounded-full shadow-lg z-20">
          {t('product.sale', 'Sale')}
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-30 shadow-lg ${isWishlisted
          ? 'bg-[#a87441] text-white'
          : 'bg-[#121212]/60 text-[#F0EAE6] hover:bg-[#a87441] backdrop-blur-sm'
          }`}
        aria-label={isWishlisted ? t('product.removeFromWishlist') : t('product.addToWishlist')}
      >
        <Icons.Heart
          filled={isWishlisted}
          className={`transition-all duration-300 ${isWishlisted ? 'scale-110' : ''}`}
        />
      </button>

      {/* Quick Add Button */}
      {quickAdd && product.availableForSale !== false && (
        <button
          className="absolute bottom-4 left-4 right-4 bg-[#a87441] hover:bg-[#8B5E3C] text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl z-30 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          <Icons.Bag />
          {t('product.quickAdd', 'Quick Add')}
        </button>
      )}
    </>
  );

  return (
    <motion.div
      className="group/card relative"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        {/* Tilted Card Image Container */}
        <div className="relative aspect-[3/4] mb-4">
          {images.length > 0 ? (
            <TiltedCard
              imageSrc={images[currentImage].url}
              altText={images[currentImage].altText || product.title}
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={<OverlayContent />}
            />
          ) : (
            <div className="w-full h-full bg-[#1A1A1A] rounded-xl flex items-center justify-center">
              <span className="text-[#AA9B8F] text-sm font-light tracking-wider">No image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-serif text-[#F0EAE6] text-[15px] leading-snug group-hover/card:text-[#a87441] transition-all duration-300 line-clamp-2 group-hover/card:tracking-wide">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-[#F0EAE6] font-medium transition-all duration-300 group-hover/card:text-[#D4AF87]">
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
