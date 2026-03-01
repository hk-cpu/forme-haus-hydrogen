import {useState} from 'react';
import {motion} from 'framer-motion';

interface BlurRevealImageProps {
  src: string;
  blurSrc: string;
  alt: string;
  className?: string;
  /** Duration of one full blur→clear→blur cycle in seconds */
  cycleDuration?: number;
  /** Whether to snap to clear on hover */
  revealOnHover?: boolean;
}

/**
 * BlurRevealImage — ambient crossfade between a blurred and clear image.
 *
 * Two layers stacked:
 *   Bottom: blurred image (always visible)
 *   Top: clear image (opacity pulses 0 → 1 → 0 on a loop)
 *
 * On hover, the clear image snaps to full opacity.
 */
export function BlurRevealImage({
  src,
  blurSrc,
  alt,
  className = '',
  cycleDuration = 5,
  revealOnHover = true,
}: BlurRevealImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => revealOnHover && setIsHovered(true)}
      onMouseLeave={() => revealOnHover && setIsHovered(false)}
    >
      {/* Bottom layer: blurred image */}
      <img
        src={blurSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Top layer: clear image with pulsing opacity */}
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        animate={
          isHovered
            ? {opacity: 1}
            : {
                opacity: [0, 1, 1, 0],
              }
        }
        transition={
          isHovered
            ? {duration: 0.6, ease: 'easeOut'}
            : {
                duration: cycleDuration,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
                times: [0, 0.35, 0.65, 1],
              }
        }
      />
    </div>
  );
}

export default BlurRevealImage;
