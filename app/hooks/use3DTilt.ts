import {useMotionValue, useSpring, useTransform} from 'framer-motion';
import {useCallback} from 'react';

interface Use3DTiltOptions {
  maxRotation?: number;
  stiffness?: number;
  damping?: number;
}

/**
 * Reusable 3D tilt effect hook
 * Extracted from ProductCard pattern for use across components
 *
 * @example
 * const { rotateX, rotateY, handlers, style } = use3DTilt({ maxRotation: 8 });
 *
 * <motion.div style={style} {...handlers}>
 *   Card content
 * </motion.div>
 */
export function use3DTilt(options: Use3DTiltOptions = {}) {
  const {maxRotation = 8, stiffness = 300, damping = 30} = options;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [maxRotation, -maxRotation]),
    {stiffness, damping},
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-maxRotation, maxRotation]),
    {stiffness, damping},
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const style = {
    rotateX,
    rotateY,
    transformPerspective: 1000,
  };

  const handlers = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  return {
    rotateX,
    rotateY,
    handlers,
    style,
  };
}
