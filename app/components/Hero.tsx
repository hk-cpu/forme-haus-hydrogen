import {motion} from 'framer-motion';

import {useTranslation} from '~/hooks/useTranslation';

export default function Hero() {
  const {t} = useTranslation();

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[300px] max-h-[560px] h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] items-center justify-center overflow-hidden bg-transparent px-6 pt-4 md:pt-6"
    >
      <div className="relative z-10 text-center">
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
          <motion.img
            src="/brand/logo-full-opt.webp"
            alt="Forme Haus - Where Essence Meets Elegance"
            className="relative z-10 h-24 w-auto object-contain drop-shadow-2xl sm:h-32 md:h-40 lg:h-48 xl:h-56"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width={480}
            height={250}
            animate={{
              y: [-8, 8, -8],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <h1 className="sr-only">
          {t(
            'hero.h1',
            'Forme Haus - Designer Phone Cases and Sunglasses in Saudi Arabia',
          )}
        </h1>

        <div className="mt-8">
          <button
            onClick={() => {
              // @ts-ignore
              if (typeof window !== 'undefined' && window.lenis) {
                // @ts-ignore
                window.lenis.scrollTo('#explore-collections', {offset: -70});
              } else {
                document
                  .getElementById('explore-collections')
                  ?.scrollIntoView({behavior: 'smooth'});
              }
            }}
            className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-sm border border-bronze/40 px-8 py-4 text-[10px] font-light uppercase tracking-[0.3em] text-warm/90 transition-colors duration-300 hover:border-bronze hover:bg-bronze/10 hover:text-bronze focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
        </div>
      </div>
    </section>
  );
}
