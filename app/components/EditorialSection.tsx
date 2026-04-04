import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef, useState} from 'react';

import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';
import {use3DTilt} from '~/hooks/use3DTilt';

interface BentoItem {
  image: string;
  alt: string;
  url: string;
  titleKey: any;
  subtitleKey?: any;
  defaultTitle: string;
  defaultSubtitle?: string;
  width: number;
  height: number;
}

// 4 editorial images — WebP optimised versions
const BENTO_ITEMS: BentoItem[] = [
  {
    image: '/brand/edit-modern-essentials-opt.webp',
    alt: 'Modern Essentials — woman in pinstripe blazer driving a vintage car',
    url: '/collections/modern-essentials',
    titleKey: 'editorial.modernEssentials.title',
    subtitleKey: 'editorial.modernEssentials.subtitle',
    defaultTitle: 'Modern Essentials',
    defaultSubtitle: 'Timeless pieces for everyday elegance',
    width: 1024,
    height: 1024,
  },
  {
    image: '/brand/edit-carry.webp',
    alt: 'Carry It Your Way — crossbody phone strap',
    url: '/collections/carry-it-your-way',
    titleKey: 'editorial.carry.title',
    subtitleKey: 'editorial.carry.subtitle',
    defaultTitle: 'Carry It Your Way',
    defaultSubtitle: 'Hands-free style',
    width: 1024,
    height: 1024,
  },
  {
    image: '/brand/edit-sun-ready-opt.webp',
    alt: 'Sun Ready — model relaxing poolside in sunglasses',
    url: '/collections/sun-ready',
    titleKey: 'editorial.sun.title',
    subtitleKey: 'editorial.sun.subtitle',
    defaultTitle: 'Sun Ready',
    defaultSubtitle: 'For golden hours',
    width: 1024,
    height: 1024,
  },
  {
    image: '/brand/edit-new-arrivals-opt.webp',
    alt: 'New Arrivals — model with sheer scarf and silver ring',
    url: '/collections/new-arrivals',
    titleKey: 'editorial.new.title',
    subtitleKey: 'editorial.new.subtitle',
    defaultTitle: 'New Arrivals',
    defaultSubtitle: 'Latest from the Haus',
    width: 1024,
    height: 1024,
  },
];

/**
 * TopCard — editorial tile with 3D tilt, card-level hover scale, and content reveal
 */
function TopCard({
  item,
  index,
  t,
  noAspect,
}: {
  item: BentoItem;
  index: number;
  t: any;
  noAspect?: boolean;
}) {
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
      whileHover={shouldReduceMotion ? {} : {scale: 1.04}}
      className={`group relative overflow-hidden rounded-[14px] bg-[#E8E4E0] ${
        noAspect ? 'h-full' : 'aspect-square'
      }`}
      style={{zIndex: isHovered ? 10 : 1, position: 'relative'}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!shouldReduceMotion) tiltHandlers.onMouseLeave();
      }}
      onMouseMove={shouldReduceMotion ? undefined : tiltHandlers.onMouseMove}
    >
      <Link to={item.url} className="block h-full">
        <motion.div
          className="relative overflow-hidden h-full"
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
            className="w-full h-full object-cover block transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
            width={item.width}
            height={item.height}
            sizes="(max-width: 768px) 100vw, 50vw"
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
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
              {t(item.titleKey, item.defaultTitle)}
            </motion.h3>
            {item.subtitleKey && (
              <motion.p
                className="text-xs text-white/70 tracking-wide mt-1"
                initial={false}
                animate={{y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.7}}
                transition={{duration: 0.3, delay: 0.1}}
              >
                {t(item.subtitleKey, item.defaultSubtitle!)}
              </motion.p>
            )}
            <motion.div
              className="mt-2 h-[1px] bg-[#D4AF87]"
              initial={{width: 24}}
              animate={{width: isHovered ? 40 : 24}}
              transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            />
          </motion.div>

          {/* Hover border glow */}
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
  const {t, isRTL} = useTranslation();
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
        {/* Section Header */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="flex justify-between items-end mb-6"
        >
          <h2 className="font-serif text-2xl md:text-3xl italic text-[#4A3C31]">
            {isRTL ? (
              <motion.span
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
              >
                {t('home.editorial', 'The Edit')}
              </motion.span>
            ) : (
              t('home.editorial', 'The Edit').split('').map((char, i) => (
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
              ))
            )}
          </h2>
        </motion.div>

        {/* Mobile: single column stack */}
        <div className="flex flex-col gap-3 md:hidden">
          <TopCard item={BENTO_ITEMS[0]} index={0} t={t} />
          <TopCard item={BENTO_ITEMS[1]} index={1} t={t} />
          <TopCard item={BENTO_ITEMS[2]} index={2} t={t} />
          <TopCard item={BENTO_ITEMS[3]} index={3} t={t} />
        </div>

        {/*
          Desktop: editorial grid
          ┌────────────────┬────────────────┐  Row 1 (360px)
          │                │  Carry It      │
          │    Modern      │  Your Way      │
          │   Essentials   │    (SQ1)       │
          │    (TALL)      ├────────────────┤  Row 2 (360px)
          │                │   Sun Ready    │
          │                │    (SQ2)       │
          └────────────────┴────────────────┘
          ┌────────────────────────────────┐  Row 3 (160px)
          │   New Arrivals  (SMALL strip)  │
          └────────────────────────────────┘
        */}
        <div
          className="hidden md:grid grid-cols-2 gap-3"
          style={{
            gridTemplateRows: '360px 360px 160px',
            isolation: 'isolate',
          }}
        >
          {/* TALL — Modern Essentials: col 1, rows 1-2 */}
          <motion.div
            className="row-span-2"
            style={shouldReduceMotion ? {} : {y: leftColY}}
          >
            <TopCard item={BENTO_ITEMS[0]} index={0} t={t} noAspect />
          </motion.div>

          {/* SQ1 — Carry It Your Way: col 2, row 1 */}
          <motion.div style={shouldReduceMotion ? {} : {y: rightColY}}>
            <TopCard item={BENTO_ITEMS[1]} index={1} t={t} noAspect />
          </motion.div>

          {/* SQ2 — Sun Ready: col 2, row 2 */}
          <motion.div style={shouldReduceMotion ? {} : {y: rightColY}}>
            <TopCard item={BENTO_ITEMS[2]} index={2} t={t} noAspect />
          </motion.div>

          {/* SMALL — New Arrivals: cols 1-2, row 3 (full-width strip) */}
          <motion.div
            className="col-span-2"
            style={shouldReduceMotion ? {} : {y: leftColY}}
          >
            <TopCard item={BENTO_ITEMS[3]} index={3} t={t} noAspect />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
