import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef, useState, useEffect} from 'react';

import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

export default function Hero() {
  const {t} = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Parallax scroll effect — only active after hydration
  const {scrollY} = useScroll();
  const logoY = useTransform(
    scrollY,
    [0, 500],
    [0, shouldReduceMotion ? 0 : 100],
  );
  const logoOpacity = useTransform(
    scrollY,
    [0, 300],
    [1, shouldReduceMotion ? 1 : 0],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[300px] sm:min-h-[320px] md:min-h-[350px] max-h-[500px] md:max-h-[600px] flex flex-col items-center justify-center bg-transparent relative overflow-hidden pt-4 md:pt-6"
    >
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="text-center px-6 z-20 relative">
          {/* Brand Logo — enlarged, rendered visible immediately for fast LCP */}
          {hydrated ? (
            <motion.div
              initial={false}
              className="mb-8 relative hero-logo-entrance"
              style={{
                y: shouldReduceMotion ? 0 : logoY,
                opacity: logoOpacity,
              }}
            >
              <div className="relative inline-block">
                {/* Soft glow halo behind logo */}
                <motion.div
                  className="absolute inset-0 opacity-0"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          opacity: [0, 0.25, 0],
                          scale: [0.96, 1.04, 0.96],
                        }
                  }
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    filter: 'blur(50px)',
                    background:
                      'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.5) 0%, transparent 65%)',
                  }}
                />

                <img
                  src="/brand/logo-full.webp"
                  alt="FORMÉ HAUS — Where Essence Meets Elegance"
                  className="w-auto h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 object-contain relative z-10 drop-shadow-2xl"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  width={640}
                  height={332}
                />

                {/* Decorative accent line */}
                <motion.div
                  className="absolute left-[-20%] right-[-20%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#a87441]/30 to-transparent hidden md:block"
                  initial={
                    shouldReduceMotion
                      ? {scaleX: 1, opacity: 1}
                      : {scaleX: 0, opacity: 0}
                  }
                  animate={{scaleX: 1, opacity: 1}}
                  transition={
                    shouldReduceMotion
                      ? {duration: 0}
                      : {
                          duration: 1.5,
                          delay: 0.8,
                          ease: [0.16, 1, 0.3, 1],
                        }
                  }
                />
              </div>
            </motion.div>
          ) : (
            /* SSR/pre-hydration: logo visible immediately via CSS animation */
            <div className="mb-8 relative hero-logo-entrance">
              <div className="relative inline-block">
                <img
                  src="/brand/logo-full.webp"
                  alt="FORMÉ HAUS — Where Essence Meets Elegance"
                  className="w-auto h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 object-contain relative z-10 drop-shadow-2xl"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  width={640}
                  height={332}
                />
              </div>
            </div>
          )}

          {/* SEO H1 — visually hidden, readable by search engines */}
          <h1 className="sr-only">
            {t(
              'hero.h1',
              'Formé Haus — Designer Phone Cases & Sunglasses | Saudi Arabia',
            )}
          </h1>

          {/* CTA Button — static position, glow on hover */}
          <motion.div
            initial={
              shouldReduceMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 10}
            }
            animate={{opacity: 1, y: 0}}
            transition={
              shouldReduceMotion
                ? {duration: 0}
                : {delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1]}
            }
          >
            <Link
              to="/collections/new-in"
              className="relative inline-flex items-center justify-center gap-3 px-8 sm:px-14 py-4 min-h-[48px] overflow-hidden group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-sm touch-target"
            >
              <span className="absolute inset-0 border border-[#a87441]/40 group-hover/btn:border-[#a87441] transition-all duration-700" />
              <span className="absolute inset-0 bg-[#a87441]/0 group-hover/btn:bg-[#a87441]/10 backdrop-blur-sm transition-all duration-700" />
              {/* Glow effect on hover */}
              <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700 pointer-events-none shadow-[0_0_25px_rgba(168,116,65,0.4),inset_0_0_25px_rgba(168,116,65,0.1)]" />
              <span className="relative text-[10px] uppercase tracking-[0.3em] font-light text-[#F0EAE6]/90 group-hover/btn:text-[#a87441] transition-all duration-700">
                {t('hero.cta', 'Explore Collection')}
              </span>
              {/* Arrow Icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="relative text-[#F0EAE6]/70 group-hover/btn:text-[#a87441] transition-all duration-500"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
