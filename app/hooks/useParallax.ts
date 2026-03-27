import type {MotionValue} from 'framer-motion';
import {useScroll, useTransform} from 'framer-motion';

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
export function useParallax(
  options: UseParallaxOptions = {},
): MotionValue<number> {
  const {speed = 0.5, offset = [0, 1]} = options;

  const {scrollYProgress} = useScroll();

  const y = useTransform(scrollYProgress, offset, [0, -100 * speed]);

  return y;
}

/**
 * Creates multiple parallax layers with different speeds
 * Useful for creating depth in editorial sections
 *
 * IMPORTANT: speeds array length must be constant between renders (React hooks rule).
 *
 * @example
 * const [slow, medium, fast] = useParallaxLayers([0.2, 0.5, 0.8]);
 */
export function useParallaxLayers(speeds: number[]): MotionValue<number>[] {
  const {scrollYProgress} = useScroll();

  // Call useTransform for a fixed max of layers (hooks must not be called conditionally)
  const layer0 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * (speeds[0] ?? 0)],
  );
  const layer1 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * (speeds[1] ?? 0)],
  );
  const layer2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * (speeds[2] ?? 0)],
  );
  const layer3 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * (speeds[3] ?? 0)],
  );
  const layer4 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * (speeds[4] ?? 0)],
  );

  const all = [layer0, layer1, layer2, layer3, layer4];
  return all.slice(0, speeds.length);
}
