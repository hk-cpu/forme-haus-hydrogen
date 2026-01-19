import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import GradientText from './GradientText';
import FocalPoint from './FocalPoint';

export default function Hero() {
  return (
    <section className="h-[90vh] flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
      <FocalPoint color="#a87441" speed={0.2} />
      <div className="text-center px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 drop-shadow-sm"
        >
          <GradientText
            colors={['#E0D8D0', '#C4A484', '#E0D8D0']}
            animationSpeed={6}
            showBorder={false}
            className="font-serif text-7xl md:text-9xl tracking-tight italic"
          >
            Where Essence Meets Elegance
          </GradientText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Link to="/collections/new-in" className="inline-block px-12 py-3 border border-[#F0EAE6]/30 text-[#F0EAE6] uppercase tracking-[0.25em] text-[10px] hover:bg-[#F0EAE6] hover:text-[#4A3C31] transition-all duration-500 ease-out backdrop-blur-sm">
            Shop The Collection
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-neutral-400">Scroll</span>
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
