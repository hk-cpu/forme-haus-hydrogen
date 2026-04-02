import {motion, useReducedMotion, type Variants} from 'framer-motion';

type AnimationType =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'fadeIn'
  | 'scaleUp'
  | 'scaleDown'
  | 'slideUp'
  | 'none';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  staggerChildren?: number;
  staggerDelay?: number;
  as?: 'div' | 'section' | 'article' | 'ul' | 'li';
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

const ANIMATION_VARIANTS: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: {opacity: 0, y: 36},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE}},
  },
  fadeDown: {
    hidden: {opacity: 0, y: -36},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE}},
  },
  fadeLeft: {
    hidden: {opacity: 0, x: 40},
    visible: {opacity: 1, x: 0, transition: {duration: 0.6, ease: EASE}},
  },
  fadeRight: {
    hidden: {opacity: 0, x: -40},
    visible: {opacity: 1, x: 0, transition: {duration: 0.6, ease: EASE}},
  },
  fadeIn: {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {duration: 0.5, ease: EASE}},
  },
  scaleUp: {
    hidden: {opacity: 0, scale: 0.92},
    visible: {opacity: 1, scale: 1, transition: {duration: 0.6, ease: EASE}},
  },
  scaleDown: {
    hidden: {opacity: 0, scale: 1.08},
    visible: {opacity: 1, scale: 1, transition: {duration: 0.6, ease: EASE}},
  },
  slideUp: {
    hidden: {y: '100%'},
    visible: {y: 0, transition: {duration: 0.8, ease: EASE}},
  },
  none: {
    hidden: {},
    visible: {},
  },
};

/**
 * AnimatedSection — scroll-triggered reveal wrapper.
 * Uses whileInView to animate children when they enter the viewport.
 * Respects prefers-reduced-motion by skipping all animation.
 *
 * Usage:
 *   <AnimatedSection animation="fadeUp" staggerChildren={3} staggerDelay={0.1}>
 *     <div>item 1</div>
 *     <div>item 2</div>
 *   </AnimatedSection>
 */
export function AnimatedSection({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration,
  className = '',
  once = true,
  amount = 0.2,
  staggerChildren = 0,
  staggerDelay = 0.1,
  as = 'div',
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const base = ANIMATION_VARIANTS[animation];

  const variants: Variants = {
    hidden: prefersReducedMotion ? {} : base.hidden,
    visible: {
      ...(base.visible as object),
      transition: {
        ...((base.visible as {transition?: object}).transition ?? {}),
        delay,
        ...(duration ? {duration} : {}),
        ...(staggerChildren > 0
          ? {staggerChildren: staggerDelay, delayChildren: delay}
          : {}),
      },
    },
  };

  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      variants={variants}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{once, amount}}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * AnimatedItem — child item for use inside a staggered AnimatedSection.
 */
export function AnimatedItem({
  children,
  animation = 'fadeUp',
  className = '',
}: {
  children: React.ReactNode;
  animation?: AnimationType;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const variants = ANIMATION_VARIANTS[animation];

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * TextReveal — animates words in one by one with a blur effect.
 */
export function TextReveal({
  text,
  className = '',
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {staggerChildren: 0.05, delayChildren: delay},
    },
  };

  const wordVariants: Variants = {
    hidden: {opacity: 0, y: 18, filter: 'blur(8px)'},
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {duration: 0.45, ease: EASE},
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{once}}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={prefersReducedMotion ? {} : wordVariants}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default AnimatedSection;
