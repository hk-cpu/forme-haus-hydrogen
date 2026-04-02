import {useTranslation} from '~/hooks/useTranslation';
import {motion, useReducedMotion} from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function Hero() {
  const {t} = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[300px] max-h-[560px] h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] items-center justify-center overflow-hidden bg-transparent px-6 pt-4 md:pt-6"
    >
      {/* Hero lifestyle background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/brand/collections-hero-v2.png"
          alt=""
          className="w-full h-full object-cover object-center opacity-90"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo with entrance fade + float */}
        <div className="relative inline-block">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              filter: 'blur(48px)',
              background:
                'radial-gradient(ellipse at center, rgba(168,116,65,0.28) 0%, transparent 68%)',
            }}
          />

          {/* Entrance wrapper — fades in from below */}
          <motion.div
            initial={prefersReducedMotion ? false : {opacity: 0, y: 20, scale: 0.96}}
            animate={{opacity: 1, y: 0, scale: 1}}
            transition={{duration: 0.8, ease: EASE}}
            className="relative z-10"
          >
            {/* Inner motion.img handles the continuous float independently */}
            <motion.img
              src="/brand/logo-full-opt.webp"
              alt="Forme Haus - Where Essence Meets Elegance"
              className="h-24 w-auto object-contain drop-shadow-2xl sm:h-28 md:h-32 lg:h-36 xl:h-40"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              width={480}
              height={250}
              animate={prefersReducedMotion ? {} : {y: [-8, 8, -8]}}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        <h1 className="sr-only">
          {t(
            'hero.h1',
            'Forme Haus - Designer Phone Cases and Sunglasses in Saudi Arabia',
          )}
        </h1>

        {/* CTA button — delayed entrance */}
        <motion.div
          className="mt-8"
          initial={prefersReducedMotion ? false : {opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.35, ease: EASE}}
        >
          <button
            onClick={() => {
              document
                .getElementById('explore-collections')
                ?.scrollIntoView({behavior: 'smooth'});
            }}
            className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-sm border border-[#a87441]/40 px-8 py-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#F0EAE6]/90 transition-colors duration-300 hover:border-[#a87441] hover:bg-[#a87441]/10 hover:text-[#a87441] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            <span>{t('hero.cta', 'Explore Collection')}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
