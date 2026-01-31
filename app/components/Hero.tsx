import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';

// Forced Update
export default function Hero() {
  return (
    <section
      className="h-[90vh] flex flex-col items-center justify-center bg-transparent relative overflow-hidden"
      style={{ height: '90vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
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
                  background: 'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.6) 0%, transparent 70%)',
                }}
              />

              <img
                src="/brand/logo-full.png"
                alt="FORMÉ HAUS - Where Essence Meets Elegance"
                className="w-auto h-32 md:h-48 lg:h-56 object-contain relative z-10 drop-shadow-2xl"
              />

              {/* Animated Silk Accent Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 400 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M0,100 Q100,80 200,100 T400,100"
                  stroke="url(#heroSilkGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 1, 0],
                    opacity: [0, 0.6, 0.6, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <defs>
                  <linearGradient id="heroSilkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a87441" stopOpacity="0" />
                    <stop offset="50%" stopColor="#a87441" stopOpacity="1" />
                    <stop offset="100%" stopColor="#a87441" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="group/cta"
          >
            <Link
              to="/collections/new-in"
              className="relative inline-flex items-center justify-center px-14 py-4 overflow-hidden group/btn"
            >
              {/* Border frame */}
              <span className="absolute inset-0 border border-[#a87441]/40 group-hover/btn:border-[#a87441] transition-all duration-700" />

              {/* Shimmer effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent"
                animate={{
                  x: ['-200%', '200%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              {/* Background on hover */}
              <span className="absolute inset-0 bg-[#a87441]/0 group-hover/btn:bg-[#a87441]/10 backdrop-blur-sm transition-all duration-700" />

              {/* Text */}
              <span className="relative text-[10px] uppercase tracking-[0.3em] font-light text-[#F0EAE6]/90 group-hover/btn:text-[#a87441] group-hover/btn:tracking-[0.35em] transition-all duration-700">
                Explore Collection
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-neutral-400 to-transparent opacity-50 overflow-hidden">
          <motion.div
            animate={{ y: [-50, 50] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
