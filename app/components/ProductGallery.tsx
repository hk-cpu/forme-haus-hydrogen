import {useState, useEffect, useCallback, useRef} from 'react';
import {Image} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

import type {MediaFragment} from 'storefrontapi.generated';

/**
 * ProductGallery – Premium 3D rotating carousel
 * Images rotate around in a circular orbit like a 360° camera,
 * with the active image front-and-center and others fading into a ring behind it.
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = media
    .filter((m) => m.__typename === 'MediaImage')
    .map((m) => ({
      id: m.id,
      url: (m as any).image?.url || '',
      altText: m.alt || 'Product image',
      width: (m as any).image?.width || 800,
      height: (m as any).image?.height || 1000,
    }))
    .filter((img) => img.url);

  const total = images.length;

  // Auto-rotate every 4 seconds
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);
  }, [total]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoPlaying && total > 1) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isAutoPlaying, total, startAutoPlay, stopAutoPlay]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    // Restart autoplay timer on manual interaction
    if (isAutoPlaying) {
      stopAutoPlay();
      startAutoPlay();
    }
  };

  const goNext = () => goTo((activeIndex + 1) % total);
  const goPrev = () => goTo((activeIndex - 1 + total) % total);

  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <div className={`${className}`}>
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#F5F2ED]">
          <Image
            data={images[0]}
            aspectRatio="3/4"
            sizes="(min-width: 768px) 60vw, 90vw"
            className="w-full h-full object-cover animate-breathe-zoom"
          />
        </div>
      </div>
    );
  }

  // Calculate positions for 3D ring effect
  const getCardStyle = (index: number) => {
    const offset = ((index - activeIndex + total) % total);
    const normalizedOffset = offset > total / 2 ? offset - total : offset;

    // Active (center)
    if (normalizedOffset === 0) {
      return {
        zIndex: 30,
        x: 0,
        scale: 1,
        opacity: 1,
        rotateY: 0,
        filter: 'brightness(1)',
      };
    }

    // Immediate left/right
    if (Math.abs(normalizedOffset) === 1) {
      const direction = normalizedOffset > 0 ? 1 : -1;
      return {
        zIndex: 20,
        x: direction * 65,
        scale: 0.75,
        opacity: 0.6,
        rotateY: direction * -35,
        filter: 'brightness(0.7)',
      };
    }

    // Second layer
    if (Math.abs(normalizedOffset) === 2) {
      const direction = normalizedOffset > 0 ? 1 : -1;
      return {
        zIndex: 10,
        x: direction * 90,
        scale: 0.55,
        opacity: 0.3,
        rotateY: direction * -50,
        filter: 'brightness(0.5)',
      };
    }

    // Far behind (hidden)
    return {
      zIndex: 0,
      x: 0,
      scale: 0.4,
      opacity: 0,
      rotateY: 180,
      filter: 'brightness(0.3)',
    };
  };

  return (
    <div
      className={`${className}`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 3D Carousel Container */}
      <div className="relative w-full" style={{perspective: '1200px'}}>
        {/* Main Carousel */}
        <div className="relative aspect-[3/4] md:aspect-[4/5] flex items-center justify-center overflow-hidden">
          {images.map((image, index) => {
            const style = getCardStyle(index);

            return (
              <motion.div
                key={image.id || index}
                className="absolute w-[75%] md:w-[70%] h-full cursor-pointer"
                animate={{
                  x: `${style.x}%`,
                  scale: style.scale,
                  rotateY: style.rotateY,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  filter: style.filter,
                }}
                onClick={() => goTo(index)}
              >
                <div className="w-full h-full rounded-lg overflow-hidden bg-[#F5F2ED] shadow-2xl">
                  <Image
                    data={image}
                    aspectRatio="3/4"
                    sizes="(min-width: 768px) 50vw, 80vw"
                    className={`w-full h-full object-cover ${
                      index === activeIndex ? 'animate-breathe-zoom' : ''
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#4A3C31] hover:bg-[#a87441] hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#4A3C31] hover:bg-[#a87441] hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-4 flex items-center justify-center gap-3 px-4">
        {images.map((image, index) => (
          <button
            key={image.id || index}
            onClick={() => goTo(index)}
            className={`relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden transition-all duration-300 ${
              index === activeIndex
                ? 'ring-2 ring-[#a87441] ring-offset-2 ring-offset-[#F9F5F0] scale-110'
                : 'opacity-50 hover:opacity-80'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              data={image}
              aspectRatio="1/1"
              sizes="64px"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === activeIndex
                ? 'w-8 bg-[#a87441]'
                : 'w-1.5 bg-[#8B8076]/30 hover:bg-[#8B8076]/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
