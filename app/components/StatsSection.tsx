import {useRef, useEffect, useState} from 'react';
import {motion, useInView, useSpring, useMotionValue, useReducedMotion} from 'framer-motion';

import {useTranslation} from '~/hooks/useTranslation';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  labelAr: string;
}

const STATS: Stat[] = [
  {
    value: 50000,
    suffix: '+',
    label: 'Happy Customers',
    labelAr: 'عميل سعيد',
  },
  {
    value: 100,
    suffix: '+',
    label: 'Premium Products',
    labelAr: 'منتج متميز',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Cities Served',
    labelAr: 'مدينة',
  },
  {
    value: 99,
    suffix: '%',
    label: 'Satisfaction Rate',
    labelAr: 'نسبة الرضا',
  },
];

// Animated counter component with slot machine effect
function CounterNumber({value, suffix, isInView}: {value: number; suffix: string; isInView: boolean}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [springValue]);

  // Format number with commas
  const formattedValue = displayValue.toLocaleString();

  return (
    <span className="tabular-nums">
      {formattedValue}
      {suffix}
    </span>
  );
}

// Slot machine digit effect for enhanced visual
function SlotDigit({digit, delay}: {digit: string; delay: number}) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <span>{digit}</span>;
  }
  
  return (
    <motion.span
      className="inline-block overflow-hidden"
      initial={{y: 20, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{delay, duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
    >
      <motion.span
        className="inline-block"
        initial={{y: 40}}
        animate={{y: 0}}
        transition={{delay, duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
      >
        {digit}
      </motion.span>
    </motion.span>
  );
}

// Single stat card with enhanced animations
function StatCard({
  stat,
  index,
  isRTL,
}: {
  stat: Stat;
  index: number;
  isRTL: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, amount: 0.5});
  const shouldReduceMotion = useReducedMotion();

  // Convert number to digits for slot machine effect
  const digits = Math.floor(stat.value).toLocaleString().split('');

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 30}}
      animate={isInView ? {opacity: 1, y: 0} : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="relative group"
    >
      <div className="text-center p-6">
        {/* Number with pulse effect */}
        <div className="relative mb-3">
          <motion.div
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#4A3C31] leading-none"
            whileHover={shouldReduceMotion ? {} : {scale: 1.05}}
            transition={{type: 'spring', stiffness: 300}}
          >
            {/* Slot machine digits */}
            {isInView && digits.map((digit, i) => (
              <SlotDigit 
                key={i} 
                digit={digit} 
                delay={index * 0.1 + i * 0.03} 
              />
            ))}
            <motion.span
              initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, scale: 0}}
              animate={isInView ? {opacity: 1, scale: 1} : {}}
              transition={{delay: index * 0.1 + 0.3, duration: 0.3}}
              className="inline-block"
            >
              {stat.suffix}
            </motion.span>
          </motion.div>

          {/* Decorative line with enhanced animation */}
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#a87441] to-transparent"
            initial={{width: 0, opacity: 0}}
            animate={isInView ? {width: 40, opacity: 1} : {}}
            transition={{delay: index * 0.1 + 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
          />
        </div>

        {/* Label with stagger */}
        <motion.p 
          className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-[#8B8076] mt-4"
          initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 10}}
          animate={isInView ? {opacity: 1, y: 0} : {}}
          transition={{delay: index * 0.1 + 0.6, duration: 0.4}}
        >
          {isRTL ? stat.labelAr : stat.label}
        </motion.p>
      </div>

      {/* Enhanced hover glow with pulse */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        initial={false}
        animate={isInView ? {} : {}}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.08) 0%, transparent 70%)',
        }}
      />
      
      {/* Radial progress ring on complete */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="12"
          fill="none"
          stroke="rgba(168, 116, 65, 0.1)"
          strokeWidth="0.5"
          initial={{pathLength: 0, opacity: 0}}
          animate={isInView ? {pathLength: 1, opacity: 1} : {}}
          transition={{duration: 1.5, delay: index * 0.1 + 0.3, ease: "easeOut"}}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 0,
          }}
        />
      </svg>
    </motion.div>
  );
}

export function StatsSection() {
  const {isRTL, t} = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {once: true, amount: 0.3});
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 border-t border-b border-[#8B8076]/10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="max-w-[var(--container-max)] mx-auto"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Section Header with split text animation */}
        <motion.div
          initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 20}}
          animate={isInView ? {opacity: 1, y: 0} : {}}
          transition={{duration: 0.6}}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-[#4A3C31] mb-2">
            {(isRTL ? 'أرقامنا تتحدث' : t('stats.title', 'Our Numbers')).split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 20}}
                animate={isInView ? {opacity: 1, y: 0} : {}}
                transition={{
                  delay: i * 0.03,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h2>
          <motion.div 
            className="h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent mx-auto"
            initial={{scaleX: 0, opacity: 0}}
            animate={isInView ? {scaleX: 1, opacity: 1} : {}}
            transition={{delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
          />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Alternative minimal version for compact spaces
export function StatsBar() {
  const {isRTL} = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="bg-[#1A1A1A] py-4 border-y border-[#a87441]/10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[var(--container-max)] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {STATS.slice(0, 3).map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 10}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: index * 0.1, duration: 0.4}}
              className="flex items-center gap-3"
            >
              <span className="text-xl md:text-2xl font-serif text-[#a87441]">
                <CounterNumber value={stat.value} suffix={stat.suffix} isInView={true} />
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#8B8076]">
                {isRTL ? stat.labelAr : stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
