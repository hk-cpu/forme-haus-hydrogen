import {useState, useEffect, useCallback, useRef} from 'react';
import {Image} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

import type {MediaFragment} from 'storefrontapi.generated';

/**
 * ProductGallery – Premium 3D rotating carousel
 * Continuous auto-looping slideshow with perspective depth.
 * The active image's background bleeds behind adjacent slides for a cinematic effect.
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sort images: prioritize lifestyle/human images (typically first few from Shopify)
  const images = media
    .filter((m) => m.__typename === 'MediaImage')
    .map((m) => ({
      id: m.id,
      url: (m as any).image?.url || '',
      altText: m.alt || 'Product image',
    }))
    .filter((img) => img.url);

  const total = images.length;

  // Continuous auto-rotation - always loops, slightly slower when hovered
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, isHovered ? 5000 : 3500);
  }, [total, isHovered]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (total > 1) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [total, startAutoPlay, stopAutoPlay]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    stopAutoPlay();
    startAutoPlay();
  };

  const goNext = () => goTo((activeIndex + 1) % total);
  const goPrev = () => goTo((activeIndex - 1 + total) % total);

  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <div className={`${className}`}>
        <div className="aspect-square md:aspect-[4/5] overflow-hidden rounded-xl bg-[#F5F2ED] shadow-xl">
          <Image
            data={images[0]}
            sizes="(min-width: 768px) 60vw, 90vw"
            className="w-full h-full object-contain p-6"
          />
        </div>
      </div>
    );
  }

  // Get adjacent indexes for the ring
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;
  const farPrevIndex = (activeIndex - 2 + total) % total;
  const farNextIndex = (activeIndex + 2) % total;

  // Calculate card style based on position relative to active
  const getCardStyle = (index: number) => {
    if (index === activeIndex) {
      return {
        zIndex: 30,
        x: '0%',
        scale: 1,
        opacity: 1,
        rotateY: 0,
        brightness: 1,
      };
    }
    if (index === nextIndex) {
      return {
        zIndex: 20,
        x: '58%',
        scale: 0.72,
        opacity: 0.7,
        rotateY: -30,
        brightness: 0.65,
      };
    }
    if (index === prevIndex) {
      return {
        zIndex: 20,
        x: '-58%',
        scale: 0.72,
        opacity: 0.7,
        rotateY: 30,
        brightness: 0.65,
      };
    }
    if (index === farNextIndex) {
      return {
        zIndex: 10,
        x: '80%',
        scale: 0.5,
        opacity: 0.3,
        rotateY: -45,
        brightness: 0.4,
      };
    }
    if (index === farPrevIndex) {
      return {
        zIndex: 10,
        x: '-80%',
        scale: 0.5,
        opacity: 0.3,
        rotateY: 45,
        brightness: 0.4,
      };
    }
    // Far behind
    return {
      zIndex: 0,
      x: '0%',
      scale: 0.3,
      opacity: 0,
      rotateY: 180,
      brightness: 0.2,
    };
  };

  return (
    <div
      className={`${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background blur of active image */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20 blur-3xl pointer-events-none -z-10">
        {images[activeIndex] && (
          <Image
            data={images[activeIndex]}
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 3D Carousel Container */}
      <div className="relative w-full" style={{perspective: '1400px'}}>
        {/* Main Carousel */}
        <div className="relative aspect-square md:aspect-[4/5] flex items-center justify-center">
          {images.map((image, index) => {
            const style = getCardStyle(index);

            return (
              <motion.div
                key={image.id || index}
                className="absolute w-[72%] md:w-[65%] h-full cursor-pointer"
                animate={{
                  x: style.x,
                  scale: style.scale,
                  rotateY: style.rotateY,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  filter: `brightness(${style.brightness})`,
                }}
                onClick={() => {
                  if (index !== activeIndex) goTo(index);
                }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#F5F2ED] shadow-2xl">
                  <Image
                    data={image}
                    sizes="(min-width: 768px) 50vw, 80vw"
                    className="w-full h-full object-contain p-5"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#2a2118] hover:bg-[#a87441] hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Previous image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#2a2118] hover:bg-[#a87441] hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Next image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-6 flex items-center justify-center gap-3 px-4">
        {images.map((image, index) => (
          <button
            key={image.id || index}
            onClick={() => goTo(index)}
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-400 ${
              index === activeIndex
                ? 'ring-2 ring-[#a87441] ring-offset-2 ring-offset-[#121212] scale-110 shadow-lg'
                : 'opacity-40 hover:opacity-70 grayscale-[50%] hover:grayscale-0'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              data={image}
              aspectRatio="1/1"
              sizes="80px"
              className="w-full h-full object-contain p-1 bg-[#F5F2ED]"
            />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === activeIndex
                ? 'w-10 bg-[#a87441]'
                : 'w-2 bg-[#8B8076]/30 hover:bg-[#8B8076]/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
