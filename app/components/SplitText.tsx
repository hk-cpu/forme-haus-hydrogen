import type {Variants} from 'framer-motion';
import {motion, useInView} from 'framer-motion';
import {useRef} from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  splitBy?: 'letter' | 'word' | 'line';
  animation?: 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideRight';
}

const animations: Record<string, Variants> = {
  fadeUp: {
    hidden: {opacity: 0, y: 50},
    visible: {opacity: 1, y: 0},
  },
  fadeIn: {
    hidden: {opacity: 0},
    visible: {opacity: 1},
  },
  scaleIn: {
    hidden: {opacity: 0, scale: 0.5},
    visible: {opacity: 1, scale: 1},
  },
  slideRight: {
    hidden: {opacity: 0, x: -30},
    visible: {opacity: 1, x: 0},
  },
};

export function SplitText({
  text,
  className = '',
  as: Component = 'span',
  delay = 0,
  staggerDelay = 0.03,
  duration = 0.4,
  once = true,
  threshold = 0.2,
  splitBy = 'letter',
  animation = 'fadeUp',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, {once, amount: threshold});

  const selectedAnimation = animations[animation];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: selectedAnimation.hidden,
    visible: {
      ...selectedAnimation.visible,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const splitText = () => {
    if (splitBy === 'word') {
      return text.split(' ');
    }
    if (splitBy === 'line') {
      return text.split('\n');
    }
    return text.split('');
  };

  const parts = splitText();

  return (
    <Component ref={ref as any} className={`inline-block ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="inline-block"
        aria-label={text}
      >
        {parts.map((part, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
            style={{whiteSpace: part === ' ' ? 'pre' : 'normal'}}
          >
            {part === ' ' ? '\u00A0' : part}
            {splitBy === 'word' && index < parts.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}

// Simpler version for headlines with word-based animation
interface SplitWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  staggerDelay?: number;
}

export function SplitWords({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  staggerDelay = 0.08,
}: SplitWordsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {once: true, amount: 0.5});
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="overflow-hidden inline-block">
          <motion.span
            initial={{y: 40, opacity: 0}}
            animate={isInView ? {y: 0, opacity: 1} : {y: 40, opacity: 0}}
            transition={{
              duration: 0.5,
              delay: delay + index * staggerDelay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`inline-block ${wordClassName}`}
          >
            {word}
            {index < words.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Character scramble effect for special headings
interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function ScrambleText({
  text,
  className = '',
  delay = 0,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {once: true, amount: 0.5});
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial={{opacity: 0}}
      animate={isInView ? {opacity: 1} : {opacity: 0}}
      transition={{delay, duration: 0.3}}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{opacity: 0}}
          animate={isInView ? {opacity: 1} : {opacity: 0}}
          transition={{
            delay: delay + index * 0.02,
            duration: 0.1,
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default SplitText;
