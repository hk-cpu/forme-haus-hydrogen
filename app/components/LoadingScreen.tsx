import {useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export function LoadingScreen({show, onDone}: {show: boolean; onDone?: () => void}) {
  useEffect(() => {
    if (!show && onDone) onDone();
  }, [show, onDone]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#121212]"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          aria-label="Loading"
        >
          <motion.img
            src="/brand/logo-full-opt.webp"
            alt="FormAc Haus"
            initial={{opacity: 0, scale: 0.98}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            transition={{duration: 1.0, ease: [0.25, 0.1, 0.25, 1]}}
            className="h-14 w-auto md:h-16"
            decoding="async"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default LoadingScreen;

