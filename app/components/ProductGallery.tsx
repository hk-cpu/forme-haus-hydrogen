import {useState, useEffect, useCallback, useRef} from 'react';
import {motion, AnimatePresence, useAnimation} from 'framer-motion';

import type {MediaFragment} from 'storefrontapi.generated';

// ============================================================================
// PREMIUM ICONS
// ============================================================================
const Icons = {
  ChevronLeft: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronRight: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Play: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Expand: ({className = ''}: {className?: string}) => (
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
        d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ZoomIn: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path
        d="M21 21l-4.35-4.35M11 8v6M8 11h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ZoomOut: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path
        d="M21 21l-4.35-4.35M8 11h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Close: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ImageIcon: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/**
 * ProductGallery – Premium 3D rotating carousel with physics-based animations
 * Enhanced with interactive controls, smooth transitions, and luxury polish
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({x: 0.5, y: 0.5});
  const [touchStart, setTouchStart] = useState<{x: number; y: number} | null>(
    null,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  // Refs to avoid stale closures in interval callbacks
  const isHoveredRef = useRef(isHovered);
  const isAutoPlayingRef = useRef(isAutoPlaying);
  isHoveredRef.current = isHovered;
  isAutoPlayingRef.current = isAutoPlaying;

  // Sort images: prioritize lifestyle/human images
  const images = media
    .filter((m) => m.__typename === 'MediaImage')
    .map((m) => ({
      id: m.id,
      url: (m as any).image?.url || '',
      altText: m.alt || 'Product image',
      width: (m as any).image?.width || 1200,
      height: (m as any).image?.height || 1200,
    }))
    .filter((img) => img.url);

  const total = images.length;

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-rotation using refs to prevent stale closure issues
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isAutoPlayingRef.current || isHoveredRef.current) return;

    intervalRef.current = setInterval(
      () => {
        if (!isAutoPlayingRef.current || isHoveredRef.current) {
          return;
        }
        setActiveIndex((prev) => (prev + 1) % total);
      },
      4000,
    );
  }, [total]);

  useEffect(() => {
    if (total > 1) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [total, startAutoPlay, stopAutoPlay]);

  // Restart/stop autoplay when hover or autoplay state changes
  useEffect(() => {
    stopAutoPlay();
    if (isAutoPlaying && !isHovered && total > 1) {
      startAutoPlay();
    }
  }, [isHovered, isAutoPlaying, total, startAutoPlay, stopAutoPlay]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index);
      stopAutoPlay();
      startAutoPlay();
    },
    [startAutoPlay, stopAutoPlay],
  );

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % total);
  }, [activeIndex, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + total) % total);
  }, [activeIndex, total, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') setIsFullscreen(false);
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goNext, goPrev]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({x: e.touches[0].clientX, y: e.touches[0].clientY});
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const dx = touchStart.x - e.changedTouches[0].clientX;
    const dy = touchStart.y - e.changedTouches[0].clientY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  // Zoom handling
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    if (isAutoPlaying) stopAutoPlay();
    else startAutoPlay();
  };

  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <div className={`${className}`}>
        <div className="aspect-square md:aspect-[4/5] overflow-hidden rounded-xl bg-[#F5F2ED] shadow-xl group">
          <img
            src={images[0].url}
            alt={images[0].altText}
            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  // Get adjacent indexes for the 3D ring
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;
  const farPrevIndex = (activeIndex - 2 + total) % total;
  const farNextIndex = (activeIndex + 2) % total;

  // Enhanced card style with better depth perception
  const getCardStyle = (index: number) => {
    const positions = {
      active: {
        zIndex: 30,
        x: '0%',
        scale: 1,
        opacity: 1,
        rotateY: 0,
        brightness: 1,
        blur: 0,
        z: 0,
      },
      next: {
        zIndex: 20,
        x: '62%',
        scale: 0.68,
        opacity: 0.6,
        rotateY: -35,
        brightness: 0.6,
        blur: 1,
        z: -50,
      },
      prev: {
        zIndex: 20,
        x: '-62%',
        scale: 0.68,
        opacity: 0.6,
        rotateY: 35,
        brightness: 0.6,
        blur: 1,
        z: -50,
      },
      farNext: {
        zIndex: 10,
        x: '85%',
        scale: 0.45,
        opacity: 0.25,
        rotateY: -50,
        brightness: 0.35,
        blur: 2,
        z: -100,
      },
      farPrev: {
        zIndex: 10,
        x: '-85%',
        scale: 0.45,
        opacity: 0.25,
        rotateY: 50,
        brightness: 0.35,
        blur: 2,
        z: -100,
      },
      hidden: {
        zIndex: 0,
        x: '0%',
        scale: 0.25,
        opacity: 0,
        rotateY: 180,
        brightness: 0.15,
        blur: 4,
        z: -150,
      },
    };

    if (index === activeIndex) return positions.active;
    if (index === nextIndex) return positions.next;
    if (index === prevIndex) return positions.prev;
    if (index === farNextIndex) return positions.farNext;
    if (index === farPrevIndex) return positions.farPrev;
    return positions.hidden;
  };

  return (
    <>
      <div
        className={`${className} relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{opacity: 0, scale: 1.1}}
              animate={{opacity: 0.15, scale: 1}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{duration: 0.8, ease: 'easeOut'}}
              className="absolute inset-[-20%]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(168,116,65,0.18) 0%, rgba(168,116,65,0.06) 40%, transparent 70%)',
              }}
            />
          </AnimatePresence>
        </div>

        {/* 3D Carousel Container */}
        <div className="relative w-full" style={{perspective: '1600px'}}>
          {/* Main Carousel */}
          <div
            ref={containerRef}
            className="relative aspect-square md:aspect-[4/5] flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onClick={() => isZoomed && setIsZoomed(false)}
          >
            {images.map((image, index) => {
              const style = getCardStyle(index);
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={image.id || index}
                  className={`absolute w-[70%] md:w-[62%] h-full ${
                    isActive ? 'cursor-pointer' : 'cursor-pointer'
                  }`}
                  animate={{
                    x: style.x,
                    scale: style.scale,
                    rotateY: style.rotateY,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    filter: `brightness(${style.brightness}) blur(${style.blur}px)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 20,
                    mass: 0.8,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (isActive && !isZoomed) setIsZoomed(true);
                    else if (!isActive) goTo(index);
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#F5F2ED] to-[#E8E4DD] shadow-2xl"
                    whileHover={isActive ? {scale: 1.02} : {}}
                    transition={{duration: 0.3}}
                  >
                    {/* Image with zoom capability */}
                    <motion.div
                      className="w-full h-full"
                      style={{willChange: 'transform'}}
                      animate={
                        isActive && isZoomed
                          ? {
                              scale: 2,
                              x: (0.5 - mousePosition.x) * 50 + '%',
                              y: (0.5 - mousePosition.y) * 50 + '%',
                            }
                          : {
                              scale: 1,
                              x: 0,
                              y: 0,
                            }
                      }
                      transition={{type: 'spring', stiffness: 200, damping: 25}}
                    >
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="w-full h-full object-contain p-4 md:p-6"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>

                    {/* Shine effect on active image */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
                        initial={{x: '-100%', opacity: 0}}
                        animate={{x: '100%', opacity: [0, 0.5, 0]}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Shadow beneath card */}
                  <motion.div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/20 rounded-[100%] blur-xl"
                    animate={{
                      opacity: style.opacity * 0.5,
                      scale: style.scale,
                    }}
                  />
                </motion.div>
              );
            })}

            {/* Zoom Indicator */}
            <AnimatePresence>
              {isZoomed && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2"
                >
                  <Icons.ZoomOut />
                  Click to zoom out
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows with hover effects */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#2a2118] shadow-lg border border-white/20 group"
            whileHover={{scale: 1.1, x: -2}}
            whileTap={{scale: 0.95}}
            aria-label="Previous image"
          >
            <Icons.ChevronLeft className="transition-transform group-hover:-translate-x-0.5" />
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#2a2118] shadow-lg border border-white/20 group"
            whileHover={{scale: 1.1, x: 2}}
            whileTap={{scale: 0.95}}
            aria-label="Next image"
          >
            <Icons.ChevronRight className="transition-transform group-hover:translate-x-0.5" />
          </motion.button>

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
            {/* Autoplay Toggle */}
            <motion.button
              onClick={toggleAutoPlay}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg border transition-colors ${
                isAutoPlaying
                  ? 'bg-[#a87441] text-white border-[#a87441]'
                  : 'bg-white/90 text-[#2a2118] border-white/20 hover:bg-white'
              }`}
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              <AnimatePresence mode="wait">
                {isAutoPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{scale: 0, rotate: -90}}
                    animate={{scale: 1, rotate: 0}}
                    exit={{scale: 0, rotate: 90}}
                  >
                    <Icons.Pause />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{scale: 0, rotate: 90}}
                    animate={{scale: 1, rotate: 0}}
                    exit={{scale: 0, rotate: -90}}
                  >
                    <Icons.Play />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Fullscreen Toggle */}
            <motion.button
              onClick={() => setIsFullscreen(true)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#2a2118] shadow-lg border border-white/20 hover:bg-white transition-colors"
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              aria-label="View fullscreen"
            >
              <Icons.Expand />
            </motion.button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2">
              <Icons.ImageIcon className="text-[#a87441]" />
              <span className="text-sm font-medium text-[#2a2118]">
                {activeIndex + 1} <span className="text-[#8B8076]">/</span>{' '}
                {total}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Thumbnail Strip with horizontal scroll on mobile */}
        <div className="mt-8 flex items-center justify-center gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
          {images.map((image, index) => (
            <motion.button
              key={image.id || index}
              onClick={() => goTo(index)}
              className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                index === activeIndex
                  ? 'ring-2 ring-[#a87441] ring-offset-2 ring-offset-[#121212] shadow-xl'
                  : 'opacity-50 hover:opacity-80 grayscale-[30%] hover:grayscale-0'
              }`}
              whileHover={{scale: 1.05, y: -2}}
              whileTap={{scale: 0.95}}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.altText}
                className="w-full h-full object-contain p-1.5 bg-[#F5F2ED]"
                loading="lazy"
                decoding="async"
                sizes="80px"
              />

              {/* Active indicator glow */}
              {index === activeIndex && (
                <motion.div
                  layoutId="activeThumbGlow"
                  className="absolute inset-0 bg-[#a87441]/10"
                  transition={{type: 'spring', stiffness: 300, damping: 30}}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-500 relative overflow-hidden ${
                index === activeIndex
                  ? 'w-12 bg-[#a87441]/20'
                  : 'w-2 bg-[#8B8076]/20 hover:bg-[#8B8076]/40'
              }`}
              whileHover={{scale: 1.2}}
              aria-label={`Go to image ${index + 1}`}
            >
              {/* Progress fill animation */}
              {index === activeIndex && isAutoPlaying && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#a87441] rounded-full"
                  initial={{width: '0%'}}
                  animate={{width: '100%'}}
                  transition={{duration: 4, ease: 'linear'}}
                  key={`progress-${activeIndex}`}
                />
              )}
              {index === activeIndex && !isAutoPlaying && (
                <div className="absolute inset-0 bg-[#a87441] rounded-full" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Gesture hint for mobile */}
        <div className="md:hidden mt-4 flex items-center justify-center gap-2 text-[#8B8076] text-xs">
          <Icons.ChevronLeft className="w-4 h-4" />
          <span>Swipe to navigate</span>
          <Icons.ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <motion.button
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.95}}
            >
              <Icons.Close />
            </motion.button>

            {/* Navigation in fullscreen */}
            <motion.button
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: -20}}
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.95}}
            >
              <Icons.ChevronLeft />
            </motion.button>

            <motion.button
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: 20}}
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.95}}
            >
              <Icons.ChevronRight />
            </motion.button>

            {/* Fullscreen Image */}
            <motion.div
              key={activeIndex}
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.9}}
              transition={{type: 'spring', stiffness: 200, damping: 25}}
              className="max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeIndex].url}
                alt={images[activeIndex].altText}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>

            {/* Bottom thumbnails in fullscreen */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 20}}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(index);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden transition-all ${
                    index === activeIndex
                      ? 'ring-2 ring-[#a87441] scale-110'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </motion.div>

            {/* Image counter */}
            <div className="absolute top-6 left-6 text-white/60 text-sm font-medium">
              {activeIndex + 1} / {total}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
