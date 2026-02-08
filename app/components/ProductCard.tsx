import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { useUI } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

// Icons
const Icons = {
  Heart: ({ filled = false }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
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
  };
  quickAdd?: boolean;
}

/**
 * ProductCard - Enhanced product card with image carousel and wishlist
 * 
 * Features:
 * - Image carousel within card (if multiple images)
 * - Wishlist heart icon (top-right, appears on hover)
 * - "New" text badge (top-left)
 * - 3D tilt effect on hover
 * - Quick add button
 * - Dark luxury theme
 */
export function ProductCard({ product, quickAdd = true }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useUI();
  const { isRTL, t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const images = product.images?.nodes || [];
  const hasMultipleImages = images.length > 1;
  const isWishlisted = isInWishlist(product.id);
  const isNew = product.tags?.includes('new') || false;

  // 3D Tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    setIsHovered(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#1A1A1A] mb-3">
          {/* Product Image */}
          {images.length > 0 ? (
            <Image
              data={{
                url: images[currentImage].url,
                altText: images[currentImage].altText || product.title,
              }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
              <span className="text-[#AA9B8F] text-sm">No image</span>
            </div>
          )}

          {/* New Badge */}
          {isNew && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#a87441] text-white text-[10px] uppercase tracking-wider rounded">
              {t('product.new', 'New')}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted
                ? 'bg-[#a87441] text-white opacity-100'
                : 'bg-[#121212]/80 text-[#F0EAE6] opacity-0 group-hover:opacity-100 hover:bg-[#a87441]'
            }`}
            aria-label={isWishlisted ? t('product.removeFromWishlist') : t('product.addToWishlist')}
          >
            <Icons.Heart filled={isWishlisted} />
          </button>

          {/* Image Navigation Arrows */}
          {hasMultipleImages && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#121212]/80 text-[#F0EAE6] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#a87441]"
                aria-label={t('product.prevImage', 'Previous image')}
              >
                <Icons.ChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#121212]/80 text-[#F0EAE6] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#a87441]"
                aria-label={t('product.nextImage', 'Next image')}
              >
                <Icons.ChevronRight />
              </button>

              {/* Image Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImage(idx);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImage ? 'bg-[#a87441] w-4' : 'bg-[#F0EAE6]/50'
                    }`}
                    aria-label={`${t('product.goToImage', 'Go to image')} ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Quick Add Button */}
          {quickAdd && product.availableForSale !== false && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="absolute bottom-3 left-3 right-3 bg-[#a87441] hover:bg-[#8B5E3C] text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Quick add logic would go here
              }}
            >
              <Icons.Bag />
              {t('product.quickAdd', 'Quick Add')}
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-serif text-[#F0EAE6] text-[15px] leading-tight group-hover:text-[#a87441] transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-[#AA9B8F] text-sm">
            <Money data={product.priceRange.minVariantPrice} />
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
