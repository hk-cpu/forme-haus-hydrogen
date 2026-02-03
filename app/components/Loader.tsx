
import { motion } from 'framer-motion';
import logoIcon from '/brand/logo-icon-only.png'; // Assuming this path works as it is in public

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#121212]">
      <div className="relative flex flex-col items-center">
        {/* Pulsing Glow Effect */}
        <motion.div
           className="absolute inset-0 bg-[#AD9686]/20 blur-3xl rounded-full"
           animate={{
             scale: [1, 1.5, 1],
             opacity: [0.3, 0.6, 0.3],
           }}
           transition={{
             duration: 3,
             repeat: Infinity,
             ease: "easeInOut"
           }}
        />

        {/* Logo Icon Animation */}
        <motion.img
          src={logoIcon}
          alt="Loading..."
          className="w-16 h-16 md:w-20 md:h-20 object-contain z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.5, 1, 0.5], 
            scale: [1, 1.05, 1],
            rotate: [0, 0, 360] // Optional: slow rotation or just pulse
          }}
          transition={{
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" } // Slow rotation for elegance
          }}
        />
        
        {/* Text Fade In */}
        <motion.span
          className="mt-6 font-serif text-[#AD9686] text-xs tracking-[0.3em] uppercase opacity-80"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          Formé Haus
        </motion.span>
      </div>
    </div>
  );
}
