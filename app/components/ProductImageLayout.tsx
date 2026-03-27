/**
 * ProductImageLayout Component
 *
 * Custom image layouts for product pages based on client feedback:
 * - Photo 1: Wide landscape-oriented box (position: top or bottom)
 * - Photo 2 & 3: Model shots with object-fit: contain (full model visible, no cropping)
 * - Reduced container sizes while maintaining high-res images
 */

import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Image} from '@shopify/hydrogen';

interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

interface ImageConfig {
  image: ProductImage;
  type: 'landscape' | 'model' | 'standard';
  position?: 'top' | 'bottom';
}

interface ProductImageLayoutProps {
  images: ProductImage[];
  landscapePosition?: 'top' | 'bottom';
  landscapeImageIndex?: number; // Which image to use as the landscape one (default: 0)
  modelImageIndices?: number[]; // Which images are model shots (default: [1, 2])
  className?: string;
}

// Single landscape image container
function LandscapeImage({
  image,
  isTop = true,
}: {
  image: ProductImage;
  isTop?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{opacity: 0, y: isTop ? -20 : 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6, ease: [0.25, 0.1, 0.25, 1]}}
      className="w-full"
    >
      {/* Landscape container - wide aspect ratio, reduced height */}
      <div className="relative w-full aspect-[21/9] md:aspect-[21/8] rounded-xl overflow-hidden bg-[#F5F2ED] shadow-sm">
        {/* Loading skeleton */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{opacity: 1}}
              exit={{opacity: 0}}
              className="absolute inset-0 bg-gradient-to-r from-[#EDE8E3] via-[#F5F2ED] to-[#EDE8E3] animate-pulse"
            />
          )}
        </AnimatePresence>

        {/* Image with object-cover for landscape shots */}
        <img
          src={image.url}
          alt={image.altText || 'Product image'}
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          loading="eager"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Subtle gradient overlay for text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

// Model image with object-fit: contain (full model visible)
function ModelImage({image, index}: {image: ProductImage; index: number}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="w-full"
    >
      {/* Model container - 4:5 aspect ratio with contain fit */}
      <div
        className="relative w-full aspect-[4/5] md:aspect-[3/4] rounded-xl overflow-hidden bg-[#F9F7F4] shadow-sm cursor-zoom-in"
        role="button"
        tabIndex={0}
        onClick={() => setIsZoomed(!isZoomed)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsZoomed(!isZoomed);
          }
        }}
      >
        {/* Loading skeleton */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{opacity: 1}}
              exit={{opacity: 0}}
              className="absolute inset-0 bg-gradient-to-r from-[#EDE8E3] via-[#F5F2ED] to-[#EDE8E3] animate-pulse"
            />
          )}
        </AnimatePresence>

        {/* Image with object-contain to show full model (no cropping) */}
        <motion.img
          src={image.url}
          alt={image.altText || 'Product model image'}
          className="w-full h-full object-contain p-4 md:p-6"
          loading={index === 0 ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          animate={{
            scale: isZoomed ? 1.5 : 1,
          }}
          transition={{duration: 0.4, ease: [0.25, 0.1, 0.25, 1]}}
          style={{
            transformOrigin: 'center center',
          }}
        />

        {/* Zoom indicator */}
        <AnimatePresence>
          {!isZoomed && isLoaded && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#4A3C31]"
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  d="M21 21l-4.35-4.35M11 8v6M8 11h6"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom out indicator */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 10}}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] rounded-full flex items-center gap-1.5"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35M8 11h6" strokeLinecap="round" />
              </svg>
              Click to zoom out
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption placeholder */}
      <p className="mt-2 text-[11px] text-center text-[#8B8076] tracking-wide">
        {index === 0 ? 'Front View' : 'Model View'}
      </p>
    </motion.div>
  );
}

// Standard product image (for remaining images)
function StandardImage({image, index}: {image: ProductImage; index: number}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="w-full"
    >
      {/* Standard container - square aspect, smaller than before */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F5F2ED] shadow-sm">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#EDE8E3] via-[#F5F2ED] to-[#EDE8E3] animate-pulse" />
        )}

        <img
          src={image.url}
          alt={image.altText || 'Product image'}
          className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </motion.div>
  );
}

// Main component
export function ProductImageLayout({
  images,
  landscapePosition = 'top',
  landscapeImageIndex = 0,
  modelImageIndices = [1, 2],
  className = '',
}: ProductImageLayoutProps) {
  if (!images || images.length === 0) return null;

  // Filter out the special images from the standard grid
  const specialIndices = new Set([landscapeImageIndex, ...modelImageIndices]);

  const standardImages = images.filter((_, i) => !specialIndices.has(i));
  const landscapeImage = images[landscapeImageIndex];
  const modelImages = modelImageIndices.map((i) => images[i]).filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Landscape Image (if positioned at top) */}
      {landscapePosition === 'top' && landscapeImage && (
        <LandscapeImage image={landscapeImage} isTop={true} />
      )}

      {/* Grid Layout for Model and Standard Images */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {/* Model Images */}
        {modelImages.map((image, idx) => (
          <ModelImage key={image.id || idx} image={image} index={idx} />
        ))}

        {/* Standard Images (remaining) */}
        {standardImages.slice(0, 4 - modelImages.length).map((image, idx) => (
          <StandardImage
            key={image.id || idx}
            image={image}
            index={idx + modelImages.length}
          />
        ))}
      </div>

      {/* Landscape Image (if positioned at bottom) */}
      {landscapePosition === 'bottom' && landscapeImage && (
        <LandscapeImage image={landscapeImage} isTop={false} />
      )}

      {/* Additional images in a smaller row */}
      {standardImages.length > 4 - modelImages.length && (
        <div className="grid grid-cols-4 gap-2">
          {standardImages.slice(4 - modelImages.length).map((image, idx) => (
            <motion.div
              key={image.id || idx}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: idx * 0.05}}
              className="aspect-square rounded-lg overflow-hidden bg-[#F5F2ED]"
            >
              <img
                src={image.url}
                alt={image.altText || `Product image ${idx + 5}`}
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Alternative: Simple gallery with configurable layouts
export function SimpleProductGallery({
  images,
  layout = 'mixed',
  className = '',
}: {
  images: ProductImage[];
  layout?: 'mixed' | 'grid' | 'masonry';
  className?: string;
}) {
  if (!images || images.length === 0) return null;

  if (layout === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {images.map((image, i) => (
          <div
            key={image.id || i}
            className={`relative overflow-hidden rounded-xl bg-[#F5F2ED] ${
              i === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
            }`}
          >
            <img
              src={image.url}
              alt={image.altText || `Image ${i + 1}`}
              className="w-full h-full object-contain p-4"
              loading={i < 2 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    );
  }

  // Default mixed layout
  return (
    <div className={`space-y-3 ${className}`}>
      {/* First image - landscape hero */}
      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#F5F2ED]">
        <img
          src={images[0]?.url}
          alt={images[0]?.altText || 'Main image'}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Remaining images - model shots with contain */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-3">
          {images.slice(1, 3).map((image, i) => (
            <div
              key={image.id || i}
              className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F9F7F4]"
            >
              <img
                src={image.url}
                alt={image.altText || `Model view ${i + 1}`}
                className="w-full h-full object-contain p-4"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageLayout;
