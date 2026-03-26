import {Link} from '@remix-run/react';
import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef} from 'react';

import {useTranslation} from '~/hooks/useTranslation';
import {useMagneticEffect} from '~/hooks/useMagneticEffect';

export default function Hero() {
  const {t} = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effect
  const {scrollY} = useScroll();
  const logoY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 100]);
  const logoOpacity = useTransform(scrollY, [0, 300], [1, shouldReduceMotion ? 1 : 0]);
  
  // Magnetic effect for CTA
  const {x: magneticX, y: magneticY, handlers: magneticHandlers} = useMagneticEffect({
    strength: 0.3,
    stiffness: 150,
    damping: 15,
  });

  return (
    <section 
      ref={sectionRef}
      aria-label="Hero" 
      className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[300px] sm:min-h-[320px] md:min-h-[350px] max-h-[500px] md:max-h-[600px] flex flex-col items-center justify-center bg-transparent relative overflow-hidden pt-4 md:pt-6"
    >
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="text-center px-6 z-20 relative">
          {/* Brand Logo + Motion Line with Parallax */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 1.0, ease: [0.16, 1, 0.3, 1]}}
            className="mb-8 relative"
            style={{
              y: shouldReduceMotion ? 0 : logoY,
              opacity: logoOpacity,
            }}
          >
            {/* Wide container for the motion line to extend beyond logo */}
            <div className="relative inline-block">
              {/* Soft glow halo behind logo */}
              <motion.div
                className="absolute inset-0 opacity-0"
                animate={shouldReduceMotion ? {} : {
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
                src="/brand/logo-full.webp"
                alt="FORMÉ HAUS - Where Essence Meets Elegance"
                className="w-auto h-16 sm:h-20 md:h-24 lg:h-32 xl:h-40 object-contain relative z-10 drop-shadow-2xl"
                loading="eager"
                fetchPriority="high"
              />

              {/* Decorative accent line */}
              <motion.div
                className="absolute left-[-20%] right-[-20%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#a87441]/30 to-transparent hidden md:block"
                initial={shouldReduceMotion ? {scaleX: 1, opacity: 1} : {scaleX: 0, opacity: 0}}
                animate={{scaleX: 1, opacity: 1}}
                transition={shouldReduceMotion ? {duration: 0} : {
                  duration: 1.5,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </motion.div>

          {/* SEO H1 Tag - Visually hidden but readable by screen readers */}
          <h1 className="sr-only">
            {t('hero.h1', 'Designer Phone Cases & Sunglasses — Saudi Crafted')}
          </h1>

          {/* CTA Button with Magnetic Effect */}
          <motion.div
            initial={shouldReduceMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={shouldReduceMotion ? {duration: 0} : {delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
          >
            <motion.div
              {...magneticHandlers}
              style={{
                x: magneticX,
                y: magneticY,
              }}
            >
              <Link
                to="/collections/new-in"
                className="relative inline-flex items-center justify-center gap-3 px-8 sm:px-14 py-4 min-h-[48px] overflow-hidden group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-sm touch-target"
              >
                <span className="absolute inset-0 border border-[#a87441]/40 group-hover/btn:border-[#a87441] transition-all duration-700" />
                <span className="absolute inset-0 bg-[#a87441]/0 group-hover/btn:bg-[#a87441]/10 backdrop-blur-sm transition-all duration-700" />
                <span className="relative text-[10px] uppercase tracking-[0.3em] font-light text-[#F0EAE6]/90 group-hover/btn:text-[#a87441] transition-all duration-700">
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
                  className="relative text-[#F0EAE6]/70 group-hover/btn:text-[#a87441] transition-all duration-500"
                  whileHover={{x: 4}}
                  transition={{type: 'spring', stiffness: 400, damping: 20}}
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
    </section>
  );
}
