import {useState} from 'react';
import {motion, useReducedMotion} from 'framer-motion';

import {use3DTilt} from '~/hooks/use3DTilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number;
  scale?: number;
  glowColor?: string;
  showSpotlight?: boolean;
  disabled?: boolean;
}

/**
 * Reusable 3D Tilt Card Component
 *
 * Wraps children with a smooth 3D tilt effect that responds to mouse movement.
 * Automatically respects reduced motion preferences.
 *
 * @example
 * <TiltCard className="p-6 bg-white rounded-xl" maxRotation={5}>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </TiltCard>
 */
export function TiltCard({
  children,
  className = '',
  maxRotation = 8,
  scale = 1.02,
  glowColor = 'rgba(168, 116, 65, 0.15)',
  showSpotlight = true,
  disabled = false,
}: TiltCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const {style: tiltStyle, handlers: tiltHandlers} = use3DTilt({maxRotation});

  // Disable effects if reduced motion is preferred or explicitly disabled
  const isEffectivelyDisabled = disabled || shouldReduceMotion;

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      {...(isEffectivelyDisabled ? {} : tiltHandlers)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isEffectivelyDisabled) tiltHandlers.onMouseLeave();
      }}
      animate={{
        scale: isHovered ? scale : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      style={{
        ...(!isEffectivelyDisabled && {
          rotateX: isHovered ? tiltStyle.rotateX : 0,
          rotateY: isHovered ? tiltStyle.rotateY : 0,
          transformPerspective: tiltStyle.transformPerspective,
        }),
        transformStyle: 'preserve-3d',
      }}
    >
      {children}

      {/* Spotlight effect */}
      {showSpotlight && !isEffectivelyDisabled && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none opacity-0"
          animate={{opacity: isHovered ? 1 : 0}}
          transition={{duration: 0.3}}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Hover shadow */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        transition={{duration: 0.3}}
      />
    </motion.div>
  );
}

/**
 * Simpler version of TiltCard for use in grids/lists
 * No spotlight effect, just the tilt
 */
export function TiltCardSimple({
  children,
  className = '',
  maxRotation = 5,
}: Omit<TiltCardProps, 'scale' | 'glowColor' | 'showSpotlight'>) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const {style: tiltStyle, handlers: tiltHandlers} = use3DTilt({maxRotation});

  return (
    <motion.div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      {...(shouldReduceMotion ? {} : tiltHandlers)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!shouldReduceMotion) tiltHandlers.onMouseLeave();
      }}
      style={{
        ...(!shouldReduceMotion && {
          rotateX: isHovered ? tiltStyle.rotateX : 0,
          rotateY: isHovered ? tiltStyle.rotateY : 0,
          transformPerspective: tiltStyle.transformPerspective,
        }),
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}

export default TiltCard;
