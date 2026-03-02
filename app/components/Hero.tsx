import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {useTranslation} from '~/hooks/useTranslation';

export default function Hero() {
  const {t} = useTranslation();

  return (
    <section className="h-[85vh] md:h-[90vh] min-h-[500px] max-h-[900px] flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="text-center px-6 z-20 relative">
          {/* Brand Logo + Motion Line */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 1.5, ease: [0.16, 1, 0.3, 1]}}
            className="mb-12 relative"
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
                className="w-auto h-24 sm:h-32 md:h-44 lg:h-52 object-contain relative z-10 drop-shadow-2xl"
                loading="eager"
                fetchPriority="high"
              />

              {/*
                Motion Line — threads through the gap between the FH monogram
                and "FORMÉ HAUS" text. Positioned at ~52% from top of the logo
                (the visual gap). Extends 40% beyond each side of the logo for
                a dramatic cinematic feel.
              */}
              <div
                className="absolute left-[-40%] right-[-40%] z-20 pointer-events-none"
                style={{top: '52%'}}
              >
                <svg
                  className="w-full"
                  viewBox="0 0 1800 24"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Main motion line — gentle sine wave */}
                  <motion.path
                    d="M0,12 C300,12 350,6 600,6 S900,18 1200,18 S1500,6 1800,12"
                    stroke="url(#motionLineGrad)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{pathLength: 0, opacity: 0}}
                    animate={{pathLength: 1, opacity: 1}}
                    transition={{
                      pathLength: {
                        duration: 2.4,
                        delay: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: {duration: 0.8, delay: 0.6},
                    }}
                  />
                  {/* Faint secondary echo line */}
                  <motion.path
                    d="M0,12 C300,12 350,6 600,6 S900,18 1200,18 S1500,6 1800,12"
                    stroke="url(#motionLineGrad)"
                    strokeWidth="0.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{pathLength: 0, opacity: 0}}
                    animate={{pathLength: 1, opacity: 0.3}}
                    transition={{
                      pathLength: {
                        duration: 2.4,
                        delay: 1.0,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: {duration: 0.8, delay: 1.0},
                    }}
                    style={{transform: 'translateY(3px)'}}
                  />
                  {/* Traveling light particle along the line */}
                  <motion.circle
                    r="2"
                    fill="#a87441"
                    initial={{opacity: 0}}
                    animate={{opacity: [0, 0.8, 0]}}
                    transition={{
                      duration: 3,
                      delay: 2.0,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <animateMotion
                      dur="4s"
                      begin="2s"
                      repeatCount="indefinite"
                      path="M0,12 C300,12 350,6 600,6 S900,18 1200,18 S1500,6 1800,12"
                    />
                  </motion.circle>
                  <defs>
                    <linearGradient
                      id="motionLineGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#a87441" stopOpacity="0" />
                      <stop offset="15%" stopColor="#a87441" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#a87441" stopOpacity="0.9" />
                      <stop offset="85%" stopColor="#a87441" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a87441" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 1, duration: 1}}
          >
            <Link
              to="/collections/new-in"
              className="relative inline-flex items-center justify-center px-14 py-4 overflow-hidden group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-sm"
            >
              <span className="absolute inset-0 border border-[#a87441]/40 group-hover/btn:border-[#a87441] transition-all duration-700" />
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent"
                animate={{x: ['-200%', '200%']}}
                transition={{duration: 3, repeat: Infinity, ease: 'linear'}}
              />
              <span className="absolute inset-0 bg-[#a87441]/0 group-hover/btn:bg-[#a87441]/10 backdrop-blur-sm transition-all duration-700" />
              <span className="relative text-[10px] uppercase tracking-[0.3em] font-light text-[#F0EAE6]/90 group-hover/btn:text-[#a87441] group-hover/btn:tracking-[0.35em] transition-all duration-700">
                {t('hero.cta')}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
