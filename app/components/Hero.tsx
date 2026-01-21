import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import GradientText from './GradientText';
import FocalPoint from './FocalPoint';

// Forced Update
export default function Hero() {
  return (
    <section
      className="h-[90vh] flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden"
      style={{ backgroundColor: '#121212', height: '90vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >

      {/* Dynamic Video Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#121212] animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-none">
          {/* Using inline styles to bypass potential missing Tailwind config classes */}
          <span
            className="text-[10vw] uppercase font-bold tracking-tighter blur-[1px] select-none"
            style={{
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
              color: 'transparent'
            }}
          >
            Coming Soon
          </span>
        </div>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <FocalPoint color="#a87441" speed={0.2} />
        </div>

        <div className="text-center px-6 z-20 relative mix-blend-screen">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 drop-shadow-2xl"
          >
            <GradientText
              colors={['#E0D8D0', '#C4A484', '#E0D8D0']}
              animationSpeed={6}
              showBorder={false}
              className="font-serif text-7xl md:text-9xl tracking-tight italic drop-shadow-lg"
            >
              Where Essence Meets Elegance
            </GradientText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <Link to="/collections/new-in" className="inline-block px-12 py-4 border border-[#F0EAE6]/30 text-[#F0EAE6] uppercase tracking-[0.25em] text-xs hover:bg-[#F0EAE6] hover:text-[#4A3C31] transition-all duration-500 ease-out backdrop-blur-md bg-black/10 shadow-lg">
              Shop The Collection
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
