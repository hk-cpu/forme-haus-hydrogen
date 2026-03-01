import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {useTranslation} from '~/hooks/useTranslation';

export default function Hero() {
  const {t} = useTranslation();

  return (
    <section className="h-[85vh] md:h-[90vh] min-h-[500px] max-h-[900px] flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
      {/*
          Hero Background is TRANSPARENT to show the global Silk canvas from PageLayout.
          Removed conflicting overlays/gradients.
      */}

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          {/* FocalPoint 3D Element Removed for Minimal Silk Aesthetic */}
        </div>

        <div className="text-center px-6 z-20 relative">
          {/* Brand Logo with Silk Animation */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 1.5, ease: [0.16, 1, 0.3, 1]}}
            className="mb-12 relative"
          >
            <div className="relative inline-block">
              {/* Silk Glow Effect */}
              <motion.div
                className="absolute inset-0 opacity-0"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  filter: 'blur(40px)',
                  background:
                    'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.6) 0%, transparent 70%)',
                }}
              />

              <img
                src="/brand/logo-full.png"
                alt="FORMÉ HAUS - Where Essence Meets Elegance"
                className="w-auto h-24 sm:h-32 md:h-44 lg:h-52 object-contain relative z-10 drop-shadow-2xl"
                loading="eager"
                fetchPriority="high"
              />

              {/* Animated Silk Accent Line — positioned between FORMÉ and HAUS */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                viewBox="0 0 400 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* The line sits at y≈140 to align between FORMÉ and HAUS in the logo */}
                <motion.path
                  d="M-20,140 C60,136 120,144 200,140 C280,136 340,144 420,140"
                  stroke="url(#heroSilkShimmer)"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  initial={{pathLength: 0, opacity: 0}}
                  animate={{
                    pathLength: 1,
                    opacity: [0, 0.6, 0.6],
                  }}
                  transition={{
                    pathLength: {
                      duration: 2,
                      delay: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    },
                    opacity: {duration: 1.5, delay: 0.8},
                  }}
                />
                <defs>
                  {/* Flowing shimmer gradient that slides across the line */}
                  <linearGradient id="heroSilkShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a87441" stopOpacity="0">
                      <animate attributeName="stop-opacity" values="0;0.3;0" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="20%" stopColor="#a87441" stopOpacity="0.4">
                      <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" begin="0.4s" />
                    </stop>
                    <stop offset="50%" stopColor="#d4a574" stopOpacity="1">
                      <animate attributeName="stop-opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" begin="0.8s" />
                    </stop>
                    <stop offset="80%" stopColor="#a87441" stopOpacity="0.4">
                      <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" begin="1.2s" />
                    </stop>
                    <stop offset="100%" stopColor="#a87441" stopOpacity="0">
                      <animate attributeName="stop-opacity" values="0;0.3;0" dur="4s" repeatCount="indefinite" begin="1.6s" />
                    </stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 1, duration: 1}}
            className="group/cta"
          >
            <Link
              to="/collections/new-in"
              className="relative inline-flex items-center justify-center px-14 py-4 overflow-hidden group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-sm"
            >
              {/* Border frame */}
              <span className="absolute inset-0 border border-[#a87441]/40 group-hover/btn:border-[#a87441] group-focus-visible/btn:border-[#a87441] transition-all duration-700" />

              {/* Shimmer effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Background on hover */}
              <span className="absolute inset-0 bg-[#a87441]/0 group-hover/btn:bg-[#a87441]/10 backdrop-blur-sm transition-all duration-700" />

              {/* Text */}
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
