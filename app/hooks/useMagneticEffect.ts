import {useMotionValue, useSpring} from 'framer-motion';
import {useCallback} from 'react';

interface UseMagneticEffectOptions {
  strength?: number;
  stiffness?: number;
  damping?: number;
}

/**
 * Magnetic attraction effect hook
 * Creates a subtle pull toward the cursor on hover
 *
 * @example
 * const { x, y, handlers } = useMagneticEffect({ strength: 0.3 });
 *
 * <motion.div style={{ x, y }} {...handlers}>
 *   Button content
 * </motion.div>
 */
export function useMagneticEffect(options: UseMagneticEffectOptions = {}) {
  const {strength = 0.3, stiffness = 150, damping = 15} = options;

  const x = useSpring(0, {stiffness, damping});
  const y = useSpring(0, {stiffness, damping});

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = (e.clientX - centerX) * strength;
      const distanceY = (e.clientY - centerY) * strength;

      x.set(distanceX);
      y.set(distanceY);
    },
    [x, y, strength],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handlers = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  return {
    x,
    y,
    handlers,
  };
}
