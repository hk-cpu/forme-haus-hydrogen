import {useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

type Toast = {
  id: number;
  message: string;
};

const MESSAGES: string[] = [
  'Maya in Riyadh just purchased a Phone Strap',
  'Omar in Jeddah added a Sunglass Case to cart',
  'Lina in Dammam ordered a Case + Strap Bundle',
  'Sara in Khobar purchased the Aurora Case',
];

export default function SocialProofToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = (delay: number) => {
      timer.current = setTimeout(() => {
        const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        setToasts((list) => [...list.slice(-1), {id: nextId.current++, message}]);
        // Randomize next between 20s-45s
        schedule(20000 + Math.floor(Math.random() * 25000));
      }, delay);
    };

    // First reliable trigger at 10s
    schedule(10000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="fixed left-4 bottom-20 md:bottom-6 z-[340] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 10}}
            transition={{duration: 0.3}}
            className="mb-2 w-[260px] rounded-lg bg-[#1a1a1a]/95 border border-bronze/20 text-[#F0EAE6] shadow-lg pointer-events-auto"
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-bronze text-white text-[10px]">FH</span>
              <p className="text-[12px] leading-snug">
                {toast.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

