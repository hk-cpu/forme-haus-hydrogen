import {useScroll, useTransform, MotionValue} from 'framer-motion';

interface UseParallaxOptions {
  speed?: number;
  offset?: [number, number];
}

/**
 * Scroll-based parallax effect hook
 * 
 * @example
 * const y = useParallax({ speed: 0.5 });
 * 
 * <motion.div style={{ y }}>
 *   Parallax content
 * </motion.div>
 */
export function useParallax(options: UseParallaxOptions = {}): MotionValue<number> {
  const {
    speed = 0.5,
    offset = [0, 1],
  } = options;

  const {scrollYProgress} = useScroll();
  
  const y = useTransform(
    scrollYProgress,
    offset,
    [0, -100 * speed]
  );

  return y;
}

/**
 * Creates multiple parallax layers with different speeds
 * Useful for creating depth in editorial sections
 * 
 * @example
 * const [slow, medium, fast] = useParallaxLayers([0.2, 0.5, 0.8]);
 */
export function useParallaxLayers(speeds: number[]): MotionValue<number>[] {
  const {scrollYProgress} = useScroll();
  
  return speeds.map(speed => 
    useTransform(scrollYProgress, [0, 1], [0, -100 * speed])
  );
}
