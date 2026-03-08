import {useRef, useEffect, useState} from 'react';
import {motion, useInView, useSpring, useMotionValue} from 'framer-motion';
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

// Animated counter component
function CounterNumber({value, suffix}: {value: number; suffix: string}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {once: true, amount: 0.5});
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
    <span ref={ref} className="tabular-nums">
      {formattedValue}
      {suffix}
    </span>
  );
}

// Single stat card
function StatCard({
  stat,
  index,
  isRTL,
}: {
  stat: Stat;
  index: number;
  isRTL: boolean;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.5}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="relative group"
    >
      <div className="text-center p-6">
        {/* Number */}
        <div className="relative mb-3">
          <motion.div
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#4A3C31] leading-none"
            whileHover={{scale: 1.05}}
            transition={{type: 'spring', stiffness: 300}}
          >
            <CounterNumber value={stat.value} suffix={stat.suffix} />
          </motion.div>

          {/* Decorative line */}
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#a87441] to-transparent"
            initial={{width: 0}}
            whileInView={{width: 40}}
            viewport={{once: true}}
            transition={{delay: index * 0.1 + 0.5, duration: 0.6}}
          />
        </div>

        {/* Label */}
        <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-[#8B8076] mt-4">
          {isRTL ? stat.labelAr : stat.label}
        </p>
      </div>

      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.05) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}

export function StatsSection() {
  const {isRTL, t} = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {once: true, amount: 0.3});

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 border-t border-b border-[#8B8076]/10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="max-w-[1200px] mx-auto"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Section Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={isInView ? {opacity: 1, y: 0} : {}}
          transition={{duration: 0.6}}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-[#4A3C31] mb-2">
            {isRTL ? 'أرقامنا تتحدث' : t('stats.title', 'Our Numbers')}
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent mx-auto" />
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

  return (
    <div
      className="bg-[#1A1A1A] py-4 border-y border-[#a87441]/10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {STATS.slice(0, 3).map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{opacity: 0, y: 10}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: index * 0.1}}
              className="flex items-center gap-3"
            >
              <span className="text-xl md:text-2xl font-serif text-[#a87441]">
                <CounterNumber value={stat.value} suffix={stat.suffix} />
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
