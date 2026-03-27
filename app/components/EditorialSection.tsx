import {Link} from '@remix-run/react';
import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef, useState} from 'react';

import {useTranslation} from '~/hooks/useTranslation';
import {use3DTilt} from '~/hooks/use3DTilt';

interface BentoItem {
  image: string;
  alt: string;
  url: string;
  title: string;
  subtitle?: string;
}

// 4 images — two-column editorial layout mapped to brand shots
const BENTO_ITEMS: BentoItem[] = [
  {
    image: '/brand/edit-modern-essentials.webp',
    alt: 'Modern Essentials — woman in pinstripe blazer',
    url: '/collections/sunglasses',
    title: 'Modern Essentials',
    subtitle: 'Timeless pieces for everyday elegance',
  },
  {
    image: '/brand/edit-carry.webp',
    alt: 'Carry It Your Way — crossbody phone strap',
    url: '/collections/phone-cases',
    title: 'Carry It Your Way',
    subtitle: 'Hands-free style',
  },
  {
    image: '/brand/edit-sun-ready.webp',
    alt: 'Sun Ready — draped fabric detail',
    url: '/collections/sunglasses',
    title: 'Sun Ready',
    subtitle: 'For golden hours',
  },
  {
    image: '/brand/edit-new-arrivals.webp',
    alt: 'New Arrivals — poolside luxury',
    url: '/collections/new-in',
    title: 'New Arrivals',
    subtitle: 'Latest from the Haus',
  },
];

/**
 * TopCard — renders at natural image height with 3D tilt and parallax
 */
function TopCard({item, index}: {item: BentoItem; index: number}) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const {style: tiltStyle, handlers: tiltHandlers} = use3DTilt({
    maxRotation: 4,
  });

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative shrink-0 overflow-hidden rounded-[14px] bg-[#E8E4E0]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...(shouldReduceMotion ? {} : tiltHandlers)}
    >
      <Link to={item.url} className="block">
        <motion.div
          className="relative overflow-hidden"
          style={
            shouldReduceMotion
              ? {}
              : {
                  rotateX: isHovered ? tiltStyle.rotateX : 0,
                  rotateY: isHovered ? tiltStyle.rotateY : 0,
                  transformPerspective: 1000,
                }
          }
        >
          {/* Zoomed 20% to hide watermark with parallax zoom */}
          <motion.img
            src={item.image}
            alt={item.alt}
            className="w-full h-auto block transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? 'scale(1.25)' : 'scale(1.20)',
              transformOrigin: 'center center',
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />

          {/* Hover gradient - enhanced */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"
            initial={{opacity: 0}}
            animate={{opacity: isHovered ? 1 : 0}}
            transition={{duration: 0.3}}
          />

          {/* Content — always visible on mobile, hover reveal on desktop */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-4 md:p-5 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 translate-y-0 opacity-100 transition-all duration-300"
            initial={false}
          >
            <motion.h3
              className="font-serif text-lg md:text-xl text-white italic tracking-wide"
              initial={false}
              animate={{y: isHovered ? 0 : 4}}
              transition={{duration: 0.3, delay: 0.05}}
            >
              {item.title}
            </motion.h3>
            {item.subtitle && (
              <motion.p
                className="text-xs text-white/70 tracking-wide mt-1"
                initial={false}
                animate={{y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.7}}
                transition={{duration: 0.3, delay: 0.1}}
              >
                {item.subtitle}
              </motion.p>
            )}
            <motion.div
              className="mt-2 h-[1px] bg-[#D4AF87]"
              initial={{width: 24}}
              animate={{width: isHovered ? 40 : 24}}
              transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            />
          </motion.div>

          {/* Hover border with glow */}
          <motion.div
            className="absolute inset-0 rounded-[14px] border border-white/0 pointer-events-none"
            animate={{
              borderColor: isHovered
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(255,255,255,0)',
            }}
            transition={{duration: 0.3}}
            style={{
              boxShadow: isHovered
                ? 'inset 0 0 30px rgba(168,116,65,0.1)'
                : 'none',
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/**
 * BottomCard — fills remaining column space with 3D effects
 */
function BottomCard({item, index}: {item: BentoItem; index: number}) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const {style: tiltStyle, handlers: tiltHandlers} = use3DTilt({
    maxRotation: 4,
  });

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex-1 overflow-hidden rounded-[14px] bg-[#E8E4E0] min-h-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...(shouldReduceMotion ? {} : tiltHandlers)}
    >
      <Link to={item.url} className="block w-full h-full">
        <motion.div
          className="w-full h-full"
          style={
            shouldReduceMotion
              ? {}
              : {
                  rotateX: isHovered ? tiltStyle.rotateX : 0,
                  rotateY: isHovered ? tiltStyle.rotateY : 0,
                  transformPerspective: 1000,
                }
          }
        >
          <motion.img
            src={item.image}
            alt={item.alt}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? 'scale(1.25)' : 'scale(1.20)',
              transformOrigin: 'center center',
            }}
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            decoding="async"
          />

          {/* Hover gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"
            initial={{opacity: 0}}
            animate={{opacity: isHovered ? 1 : 0}}
            transition={{duration: 0.3}}
          />

          {/* Content — always visible on mobile, hover reveal on desktop */}
          <motion.div className="absolute inset-x-0 bottom-0 p-4 md:p-5 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 translate-y-0 opacity-100 transition-all duration-300">
            <motion.h3
              className="font-serif text-lg md:text-xl text-white italic tracking-wide"
              initial={false}
              animate={{y: isHovered ? 0 : 4}}
              transition={{duration: 0.3, delay: 0.05}}
            >
              {item.title}
            </motion.h3>
            {item.subtitle && (
              <motion.p
                className="text-xs text-white/70 tracking-wide mt-1"
                initial={false}
                animate={{y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.7}}
                transition={{duration: 0.3, delay: 0.1}}
              >
                {item.subtitle}
              </motion.p>
            )}
            <motion.div
              className="mt-2 h-[1px] bg-[#D4AF87]"
              initial={{width: 24}}
              animate={{width: isHovered ? 40 : 24}}
              transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            />
          </motion.div>

          {/* Hover border with glow */}
          <motion.div
            className="absolute inset-0 rounded-[14px] border border-white/0 pointer-events-none"
            animate={{
              borderColor: isHovered
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(255,255,255,0)',
            }}
            transition={{duration: 0.3}}
            style={{
              boxShadow: isHovered
                ? 'inset 0 0 30px rgba(168,116,65,0.1)'
                : 'none',
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function EditorialSection() {
  const {isRTL} = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Parallax for columns
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const leftColY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const rightColY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section
      ref={sectionRef}
      aria-label="Editorial"
      className="py-6 md:py-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="max-w-[var(--container-max)] mx-auto"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Section Header with SplitText effect */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="flex justify-between items-end mb-6"
        >
          <h2 className="font-serif text-2xl md:text-3xl italic text-[#4A3C31]">
            {'The Edit'.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h2>
        </motion.div>

        {/* Mobile: single column stack */}
        <div className="flex flex-col gap-3 md:hidden">
          <TopCard item={BENTO_ITEMS[0]} index={0} />
          <TopCard item={BENTO_ITEMS[1]} index={1} />
          <TopCard item={BENTO_ITEMS[2]} index={2} />
          <TopCard item={BENTO_ITEMS[3]} index={3} />
        </div>

        {/*
          Desktop: flexbox two-column editorial grid with parallax
          Each column: top image at natural height + bottom image fills remaining space.
        */}
        <div className="hidden md:flex gap-3 min-h-[500px] lg:min-h-[600px] xl:min-h-[750px]">
          {/* Left column with parallax */}
          <motion.div
            className="flex-1 min-w-0 flex flex-col gap-3"
            style={shouldReduceMotion ? {} : {y: leftColY}}
          >
            <TopCard item={BENTO_ITEMS[0]} index={0} />
            <BottomCard item={BENTO_ITEMS[2]} index={2} />
          </motion.div>

          {/* Right column with parallax */}
          <motion.div
            className="flex-1 min-w-0 flex flex-col gap-3"
            style={shouldReduceMotion ? {} : {y: rightColY}}
          >
            <TopCard item={BENTO_ITEMS[1]} index={1} />
            <BottomCard item={BENTO_ITEMS[3]} index={3} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
