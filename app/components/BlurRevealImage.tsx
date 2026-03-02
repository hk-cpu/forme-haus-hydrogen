import {useState, useRef, useEffect} from 'react';
import {motion, useInView} from 'framer-motion';

interface BlurRevealImageProps {
  src: string;
  blurSrc: string;
  alt: string;
  className?: string;
  /** Time in seconds for the idle breathing cycle */
  breatheDuration?: number;
  /** Whether scroll-in triggers a one-time focus reveal */
  revealOnScroll?: boolean;
}

/**
 * BlurRevealImage — Camera-focus reveal effect
 *
 * Two-layer stack:
 *   Bottom: pre-blurred image (always visible, resting state)
 *   Top: clear image that resolves on hover via opacity + CSS blur transition
 *
 * This creates a "pulling focus" illusion rather than a slideshow toggle.
 */
export function BlurRevealImage({
  src,
  blurSrc,
  alt,
  className = '',
  breatheDuration = 6,
  revealOnScroll = true,
}: BlurRevealImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {once: true, margin: '-80px'});

  // Trigger scroll reveal once
  useEffect(() => {
    if (isInView && revealOnScroll && !hasRevealed) {
      setHasRevealed(true);
    }
  }, [isInView, revealOnScroll, hasRevealed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Layer 1: Pre-blurred image — always visible, resting state */}
      <img
        src={blurSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Layer 2: Clear image — resolves on hover with focus-pull effect */}
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        initial={{opacity: 0, filter: 'blur(8px)'}}
        animate={
          isHovered
            ? {
                opacity: 1,
                filter: 'blur(0px)',
              }
            : hasRevealed
              ? {
                  // Idle breathing: very subtle clear peek, not a slideshow
                  opacity: [0, 0.25, 0.25, 0],
                  filter: [
                    'blur(6px)',
                    'blur(3px)',
                    'blur(3px)',
                    'blur(6px)',
                  ],
                }
              : {
                  opacity: 0,
                  filter: 'blur(8px)',
                }
        }
        transition={
          isHovered
            ? {
                opacity: {duration: 0.8, ease: [0.25, 0.1, 0.25, 1]},
                filter: {duration: 1.0, ease: [0.25, 0.1, 0.25, 1]},
              }
            : hasRevealed
              ? {
                  duration: breatheDuration,
                  repeat: Infinity,
                  repeatType: 'loop' as const,
                  ease: 'easeInOut',
                  times: [0, 0.35, 0.65, 1],
                }
              : {
                  duration: 0.4,
                }
        }
      />

      {/* Layer 3: Subtle grain overlay for texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}

export default BlurRevealImage;
