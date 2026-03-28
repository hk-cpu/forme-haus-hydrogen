import {type MetaFunction} from '@shopify/remix-oxygen';
import {motion, useInView} from 'framer-motion';
import {useRef} from 'react';

import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Our Story | Formé Haus'}];
};

function FadeInSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, margin: '-60px'});

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{opacity: 0, y: 30}}
      animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 30}}
      transition={{duration: 0.7, delay, ease: [0.16, 1, 0.3, 1]}}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      {/* Hero Section — Text-only with elegant spacing */}
      <div className="pt-20 md:pt-28 pb-12 md:pb-16 bg-[#F9F5F0]">
        <div className="max-w-[860px] mx-auto px-6 md:px-12 text-center">
          <motion.span
            className="text-[10px] uppercase tracking-[0.4em] text-[#a87441] block mb-4"
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2, duration: 0.6}}
          >
            Est. Riyadh
          </motion.span>
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#4A3C31] tracking-wider"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
          >
            Our Story
          </motion.h1>
          <motion.div
            className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent"
            initial={{width: 0, opacity: 0}}
            animate={{width: 64, opacity: 1}}
            transition={{delay: 0.6, duration: 0.6}}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[860px] mx-auto px-6 md:px-12 pb-16 md:pb-24">
        {/* Opening */}
        <FadeInSection>
          <p className="font-serif text-xl md:text-2xl text-[#4A3C31] leading-relaxed text-left mb-4">
            Formé Haus began in Riyadh with a desire to offer a more considered
            approach to modern luxury, where selection is intentional, and
            elegance is enduring.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="mt-8 mb-14 h-px w-20 bg-gradient-to-r from-[#a87441]/40 to-transparent" />
        </FadeInSection>

        {/* Body */}
        <div className="space-y-8 text-[15px] md:text-base text-[#4A3C31]/80 leading-[1.85] font-light">
          <FadeInSection>
            <p>
              Founded as a proudly woman-led business, Formé Haus reflects a
              distinctly feminine perspective shaped by intuition, refinement,
              and authenticity.
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              We curate international designers whose work embodies integrity,
              craftsmanship, and lasting design. Each piece is selected for its
              presence, for the way it moves, feels, and integrates seamlessly
              into a woman&apos;s everyday expression.
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              Our edits are released in limited quantities, preserving
              distinction and balance. We are drawn to balanced silhouettes,
              tactile textures, and craftsmanship defined by quiet confidence.
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              At its core, Formé Haus is guided by the belief that true elegance
              is revealed through thoughtful selection and in choosing only what
              endures.
            </p>
          </FadeInSection>

          <FadeInSection>
            <p className="font-serif text-lg md:text-xl text-[#4A3C31] italic py-4">
              Formé Haus is more than an online destination. It is a curated
              perspective — where essence meets elegance.
            </p>
          </FadeInSection>
        </div>

        {/* Editorial divider */}
        <FadeInSection className="my-16 md:my-20">
          <div className="py-10 md:py-14 border-y border-[#a87441]/15">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#a87441] block mb-4">
              Curated with intention
            </span>
            <p className="font-serif text-2xl md:text-3xl text-[#4A3C31] italic leading-relaxed max-w-lg">
              Where every detail is considered and nothing is left to chance.
            </p>
          </div>
        </FadeInSection>

        {/* Philosophy */}
        <FadeInSection>
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#a87441] block mb-3">
              Formé Haus
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider">
              Our Philosophy
            </h2>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#a87441]/40 to-transparent" />
          </div>
        </FadeInSection>

        <div className="space-y-8 text-[15px] md:text-base text-[#4A3C31]/80 leading-[1.85] font-light">
          <FadeInSection>
            <p>We believe elegance is a presence, not a performance.</p>
          </FadeInSection>

          <FadeInSection>
            <p>
              It reveals itself in quiet confidence, in measured movement, in
              the assurance of knowing who you are.
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              The pieces we are drawn to feel instinctive rather than imposed,
              effortless, composed, and aligned with a woman&apos;s natural
              rhythm.
            </p>
          </FadeInSection>

          <FadeInSection>
            <p className="font-serif text-lg md:text-xl text-[#4A3C31] pt-4">
              Luxury, to us, is thoughtful. Personal. Enduring.
            </p>
          </FadeInSection>
        </div>

        {/* Closing divider */}
        <FadeInSection className="mt-16 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-[#a87441]/30 to-transparent" />
        </FadeInSection>
      </div>
    </div>
  );
}
