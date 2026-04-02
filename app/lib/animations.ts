/**
 * Formé Haus — Animation Tokens
 * Centralized Framer Motion variants and transition presets.
 * Brand palette: gold #a87441 / #D4AF87, dark bg #121212
 */

import {
  type Variants,
  type Transition,
  useInView,
  useReducedMotion,
  useAnimation,
} from 'framer-motion';
import {useEffect, type RefObject} from 'react';

// ─── Easing ──────────────────────────────────────────────────────────────────

export const ease = {
  luxe: [0.25, 0.1, 0.25, 1] as const,
  smooth: [0.16, 1, 0.3, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
} as const;

// ─── Transitions ─────────────────────────────────────────────────────────────

export const t = {
  fast: {duration: 0.2, ease: ease.luxe} as Transition,
  base: {duration: 0.35, ease: ease.luxe} as Transition,
  reveal: {duration: 0.6, ease: ease.smooth} as Transition,
  slow: {duration: 0.8, ease: ease.smooth} as Transition,
  dramatic: {duration: 1.2, ease: ease.smooth} as Transition,
} as const;

// ─── Core Variants ───────────────────────────────────────────────────────────

export const fadeInUp: Variants = {
  hidden: {opacity: 0, y: 30},
  visible: {opacity: 1, y: 0, transition: t.reveal},
};

export const fadeIn: Variants = {
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: t.base},
};

export const fadeInScale: Variants = {
  hidden: {opacity: 0, scale: 0.96},
  visible: {opacity: 1, scale: 1, transition: t.reveal},
};

export const slideInLeft: Variants = {
  hidden: {opacity: 0, x: -50},
  visible: {opacity: 1, x: 0, transition: t.reveal},
};

export const slideInRight: Variants = {
  hidden: {opacity: 0, x: 50},
  visible: {opacity: 1, x: 0, transition: t.reveal},
};

// ─── Stagger ─────────────────────────────────────────────────────────────────

export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0,
): Variants => ({
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {staggerChildren, delayChildren}},
});

export const staggerItem: Variants = {
  hidden: {opacity: 0, y: 24},
  visible: {opacity: 1, y: 0, transition: t.reveal},
};

// ─── Drawer / Overlay ────────────────────────────────────────────────────────

export const drawerRight: Variants = {
  hidden: {x: '100%', transition: {duration: 0.3, ease: ease.in}},
  visible: {x: 0, transition: {duration: 0.4, ease: ease.smooth}},
};

export const overlayFade: Variants = {
  hidden: {opacity: 0, transition: {duration: 0.2}},
  visible: {opacity: 1, transition: {duration: 0.3}},
};

// ─── Nav ─────────────────────────────────────────────────────────────────────

export const navDropdown: Variants = {
  hidden: {opacity: 0, y: -8, pointerEvents: 'none' as const},
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto' as const,
    transition: t.base,
  },
  exit: {
    opacity: 0,
    y: -8,
    pointerEvents: 'none' as const,
    transition: {duration: 0.18, ease: ease.in},
  },
};

// ─── Product / Card ──────────────────────────────────────────────────────────

export const productGrid = (stagger = 0.07): Variants => ({
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {staggerChildren: stagger, delayChildren: 0.05}},
});

export const productCard: Variants = {
  hidden: {opacity: 0, y: 32},
  visible: {opacity: 1, y: 0, transition: t.reveal},
};

export const quickViewReveal: Variants = {
  rest: {opacity: 0, y: 8},
  hover: {opacity: 1, y: 0, transition: {duration: 0.22, ease: ease.luxe}},
};

// ─── Image ───────────────────────────────────────────────────────────────────

export const imageReveal: Variants = {
  hidden: {opacity: 0, filter: 'blur(8px)'},
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {duration: 0.7, ease: ease.smooth},
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export const pageTransition: Variants = {
  initial: {opacity: 0},
  animate: {opacity: 1, transition: {duration: 0.4, ease: ease.luxe}},
  exit: {opacity: 0, transition: {duration: 0.25, ease: ease.in}},
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fires animation controls when element scrolls into view.
 * Respects prefers-reduced-motion by instantly setting visible state.
 */
export function useScrollReveal(
  ref: RefObject<Element | null>,
  {once = true, amount = 0.25}: {once?: boolean; amount?: number} = {},
) {
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const inView = useInView(ref, {once, amount});

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set('visible');
      return;
    }
    if (inView) controls.start('visible');
    else if (!once) controls.start('hidden');
  }, [inView, controls, once, prefersReducedMotion]);

  return {controls, inView};
}
