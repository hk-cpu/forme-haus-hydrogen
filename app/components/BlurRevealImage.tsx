import {useState, useRef, useEffect} from 'react';
import {motion, useInView} from 'framer-motion';

interface BlurRevealImageProps {
  src: string;
  blurSrc: string;
  alt: string;
  className?: string;
  breatheDuration?: number;
  revealOnScroll?: boolean;
  showVignette?: boolean;
  /** External hover control from parent card — prevents mouseleave on sibling elements */
  isHovered?: boolean;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
}

/**
 * BlurRevealImage — Camera autofocus reveal effect
 *
 * Two-phase animation (correctly separated):
 *   Phase 1 — Scroll-in reveal: single-shot hunt→lock (no repeat, no fade-to-zero bug)
 *   Phase 2 — Idle breathing: gentle oscillation between 55% and 75% opacity
 *   Override — Hover: instant snap to full clarity + spring scale
 *
 * `isHovered` prop accepts external hover state from the parent card wrapper
 * so mouseleave doesn't fire when cursor moves over sibling overlay text.
 */
export function BlurRevealImage({
  src,
  blurSrc,
  alt,
  className = '',
  breatheDuration = 6,
  revealOnScroll = true,
  showVignette = false,
  isHovered: externalHover,
  objectFit = 'cover',
  objectPosition = 'center',
}: BlurRevealImageProps) {
  const [internalHover, setInternalHover] = useState(false);
  const [phase, setPhase] = useState<'hidden' | 'reveal' | 'idle'>('hidden');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {once: true, margin: '-60px'});

  const isHovered = externalHover !== undefined ? externalHover : internalHover;

  useEffect(() => {
    if (isInView && revealOnScroll && phase === 'hidden') {
      const timer = setTimeout(() => setPhase('reveal'), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, revealOnScroll, phase]);

  // Phase 1: single-shot hunt→lock (no repeat = no disappear-on-loop bug)
  const revealAnimate = {
    opacity: [0, 0.35, 1],
    filter: ['blur(10px)', 'blur(14px)', 'blur(0px)'],
    scale: [1, 0.997, 1.015],
  };
  const revealTransition = {
    duration: 1.1,
    times: [0, 0.25, 1],
    ease: 'easeInOut' as const,
  };

  // Phase 2: idle breathing — oscillates, never fades to 0
  const idleAnimate = {
    opacity: [0.55, 0.75, 0.55],
    filter: ['blur(2.5px)', 'blur(0.5px)', 'blur(2.5px)'],
    scale: [1.012, 1.018, 1.012],
  };
  const idleTransition = {
    duration: breatheDuration,
    ease: 'easeInOut' as const,
    repeat: Infinity,
    repeatType: 'loop' as const,
  };

  // Hover: snap to clarity with spring overshoot
  const hoverAnimate = {opacity: 1, filter: 'blur(0px)', scale: 1.04};
  const hoverTransition = {
    opacity: {duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number]},
    filter: {duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number,number,number,number]},
    scale: {duration: 0.75, ease: [0.34, 1.56, 0.64, 1] as [number,number,number,number]},
  };

  const hiddenAnimate = {opacity: 0, filter: 'blur(10px)', scale: 1};

  const currentAnimate = isHovered
    ? hoverAnimate
    : phase === 'idle'
      ? idleAnimate
      : phase === 'reveal'
        ? revealAnimate
        : hiddenAnimate;

  const currentTransition = isHovered
    ? hoverTransition
    : phase === 'idle'
      ? idleTransition
      : phase === 'reveal'
        ? revealTransition
        : {duration: 0.3};

  const handleAnimationComplete = () => {
    if (phase === 'reveal') setPhase('idle');
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => { if (externalHover === undefined) setInternalHover(true); }}
      onMouseLeave={() => { if (externalHover === undefined) setInternalHover(false); }}
    >
      {/* Layer 1: Pre-blurred — always visible resting state */}
      <img
        src={blurSrc}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-${objectFit}`}
        style={{objectPosition}}
        loading="lazy"
      />

      {/* Layer 2: Clear image — focus-pull reveal */}
      <motion.img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-${objectFit}`}
        loading="lazy"
        style={{willChange: 'filter, transform, opacity', objectPosition}}
        initial={hiddenAnimate}
        animate={currentAnimate}
        transition={currentTransition}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Layer 3: Optional vignette (disabled by default when cards have gradient overlays) */}
      {showVignette && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)',
          }}
        />
      )}

      {/* Layer 4: Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}

export default BlurRevealImage;
