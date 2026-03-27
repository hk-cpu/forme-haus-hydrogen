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
      {/* Hero Section — Full-width brand image with overlay */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-[#E8E4E0]">
        <motion.img
          src="/brand/edit-modern-essentials.webp"
          alt="Formé Haus — Where Essence Meets Elegance"
          className="w-full h-full object-contain"
          initial={{scale: 1.08}}
          animate={{scale: 1}}
          transition={{duration: 1.4, ease: [0.16, 1, 0.3, 1]}}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-[#121212]/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 px-6">
          <motion.span
            className="text-[10px] uppercase tracking-[0.4em] text-[#a87441] mb-3"
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4, duration: 0.6}}
          >
            Est. Riyadh
          </motion.span>
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#F0EAE6] tracking-wider text-center"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
          >
            Our Story
          </motion.h1>
          <motion.div
            className="mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent"
            initial={{width: 0, opacity: 0}}
            animate={{width: 64, opacity: 1}}
            transition={{delay: 0.8, duration: 0.6}}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[860px] mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Opening */}
        <FadeInSection>
          <p className="font-serif text-xl md:text-2xl text-[#4A3C31] leading-relaxed text-center mb-4">
            Formé Haus began in Riyadh with a desire to offer a more considered
            approach to modern luxury, where selection is intentional, and
            elegance is enduring.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="mx-auto mt-8 mb-14 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/40 to-transparent" />
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
            <p className="font-serif text-lg md:text-xl text-[#4A3C31] text-center italic py-4">
              Formé Haus is more than an online destination.
              <br />
              It is a curated perspective — where essence meets elegance.
            </p>
          </FadeInSection>
        </div>

        {/* Editorial divider */}
        <FadeInSection className="my-16 md:my-20">
          <div className="text-center py-10 md:py-14 border-y border-[#a87441]/15">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#a87441] block mb-4">
              Curated with intention
            </span>
            <p className="font-serif text-2xl md:text-3xl text-[#4A3C31] italic leading-relaxed max-w-lg mx-auto">
              Where every detail is considered
              <br />
              and nothing is left to chance.
            </p>
          </div>
        </FadeInSection>

        {/* Philosophy */}
        <FadeInSection>
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#a87441] block mb-3">
              Formé Haus
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider">
              Our Philosophy
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#a87441]/40 to-transparent" />
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
            <p className="font-serif text-lg md:text-xl text-[#4A3C31] text-center pt-4">
              Luxury, to us, is thoughtful.
              <br />
              Personal.
              <br />
              Enduring.
            </p>
          </FadeInSection>
        </div>

        {/* Closing divider */}
        <FadeInSection className="mt-16 mb-8">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#a87441]/30 to-transparent" />
        </FadeInSection>
      </div>
    </div>
  );
}
