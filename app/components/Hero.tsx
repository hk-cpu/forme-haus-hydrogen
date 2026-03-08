import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {SplitText} from '~/components/SplitText';
import {useTranslation} from '~/hooks/useTranslation';

export default function Hero() {
  const {t} = useTranslation();

  return (
    <section className="h-[70vh] md:h-[75vh] min-h-[400px] max-h-[700px] flex flex-col items-center justify-center bg-transparent relative overflow-hidden mobile-snap-section pt-[72px] md:pt-[112px]">
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="text-center px-6 z-20 relative">
          {/* Brand Logo + Motion Line */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 1.5, ease: [0.16, 1, 0.3, 1]}}
            className="mb-8 relative"
          >
            {/* Wide container for the motion line to extend beyond logo */}
            <div className="relative inline-block">
              {/* Soft glow halo behind logo */}
              <motion.div
                className="absolute inset-0 opacity-0"
                animate={{
                  opacity: [0, 0.25, 0],
                  scale: [0.96, 1.04, 0.96],
                }}
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
                src="/brand/logo-full.png"
                alt="FORMÉ HAUS - Where Essence Meets Elegance"
                className="w-auto h-16 sm:h-20 md:h-28 lg:h-40 object-contain relative z-10 drop-shadow-2xl"
                loading="eager"
                fetchPriority="high"
              />

              {/* Decorative accent line */}
              <motion.div
                className="absolute left-[-20%] right-[-20%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#a87441]/30 to-transparent hidden md:block"
                initial={{scaleX: 0, opacity: 0}}
                animate={{scaleX: 1, opacity: 1}}
                transition={{
                  duration: 1.5,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </motion.div>

          {/* Brand Tagline with Split Text Animation */}
          <div className="mb-6">
            <SplitText
              text={t('hero.tagline', 'Where Essence Meets Elegance')}
              className="text-[10px] uppercase tracking-[0.35em] text-[#AA9B8F]/70 font-light"
              delay={1.8}
              staggerDelay={0.04}
              duration={0.5}
            />
          </div>

          {/* CTA Button with Icon */}
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
          >
            <Link
              to="/collections/new-in"
              className="relative inline-flex items-center justify-center gap-3 px-8 sm:px-14 py-4 min-h-[48px] overflow-hidden group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-sm"
            >
              <span className="absolute inset-0 border border-[#a87441]/40 group-hover/btn:border-[#a87441] transition-all duration-700" />
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent"
                animate={{x: ['-200%', '200%']}}
                transition={{duration: 3, repeat: Infinity, ease: 'linear'}}
              />
              <span className="absolute inset-0 bg-[#a87441]/0 group-hover/btn:bg-[#a87441]/10 backdrop-blur-sm transition-all duration-700" />
              <span className="relative text-[10px] uppercase tracking-[0.3em] font-light text-[#F0EAE6]/90 group-hover/btn:text-[#a87441] group-hover/btn:tracking-[0.35em] transition-all duration-700">
                {t('hero.cta', 'Explore Collection')}
              </span>
              {/* Arrow Icon */}
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="relative text-[#F0EAE6]/70 group-hover/btn:text-[#a87441] group-hover/btn:translate-x-1 transition-all duration-500"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
