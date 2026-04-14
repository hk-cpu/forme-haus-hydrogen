import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef, useState} from 'react';

import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';
import {use3DTilt} from '~/hooks/use3DTilt';

interface BundlePiece {
  label: string;
  image: string;
}

interface BentoItem {
  image: string;
  alt: string;
  url: string;
  titleKey: any;
  subtitleKey?: any;
  defaultTitle: string;
  defaultSubtitle?: string;
  pieces: BundlePiece[];
  width: number;
  height: number;
}

// 4 themed bundle cards — each represents a curated product combination
const BENTO_ITEMS: BentoItem[] = [
  {
    image: '/brand/edit-modern-essentials-v2.png',
    alt: 'The Essential Edit — case, strap and sunglasses curated together',
    url: '/collections/modern-essentials',
    titleKey: 'editorial.modernEssentials.title',
    subtitleKey: 'editorial.modernEssentials.subtitle',
    defaultTitle: 'The Essential Edit',
    defaultSubtitle: '3 piece set',
    pieces: [
      {label: 'Phone Case', image: '/brand/phone-accessories-opt.webp'},
      {label: 'Phone Strap', image: '/brand/carry-hero-v2.webp'},
      {label: 'Sunglasses', image: '/brand/sunglasses-opt.webp'},
    ],
    width: 1024,
    height: 1024,
  },
  {
    image: '/brand/edit-carry.webp',
    alt: 'The Phone Kit — phone case paired with a matching strap',
    url: '/collections/carry-it-your-way',
    titleKey: 'editorial.carry.title',
    subtitleKey: 'editorial.carry.subtitle',
    defaultTitle: 'The Phone Kit',
    defaultSubtitle: '2 piece set',
    pieces: [
      {label: 'Phone Case', image: '/brand/phone-accessories-opt.webp'},
      {label: 'Phone Strap', image: '/brand/carry-hero-v2.webp'},
    ],
    width: 1024,
    height: 1024,
  },
  {
    image: '/brand/edit-sun-ready-v2.png',
    alt: 'The Sun Set — sunglasses paired with a coordinating phone case',
    url: '/collections/sun-ready',
    titleKey: 'editorial.sun.title',
    subtitleKey: 'editorial.sun.subtitle',
    defaultTitle: 'The Sun Set',
    defaultSubtitle: '2 piece set',
    pieces: [
      {label: 'Sunglasses', image: '/brand/sunglasses-opt.webp'},
      {label: 'Phone Case', image: '/brand/phone-accessories-opt.webp'},
    ],
    width: 1024,
    height: 1024,
  },
  {
    image: '/brand/edit-new-arrivals-v2.png',
    alt: 'The New Season — latest curated bundle from the Haus',
    url: '/collections/new-arrivals',
    titleKey: 'editorial.new.title',
    subtitleKey: 'editorial.new.subtitle',
    defaultTitle: 'The New Season',
    defaultSubtitle: 'Curated set',
    pieces: [
      {label: 'Phone Case', image: '/brand/new-in-opt.webp'},
      {label: 'Sunglasses', image: '/brand/sunglasses-opt.webp'},
      {label: 'Phone Strap', image: '/brand/carry-hero-v2.webp'},
    ],
    width: 1024,
    height: 1024,
  },
];

/**
 * TopCard — bundle/set editorial card with 3D tilt and parallax
 */
function TopCard({item, index, t}: {item: BentoItem; index: number; t: any}) {
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
      className="group relative overflow-hidden rounded-[14px] bg-[#E8E4E0] aspect-square"
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
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
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

          {/* Persistent dark gradient so text is always legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Bundle badge — top-left */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF87]" />
            <span className="text-[9px] uppercase tracking-[0.18em] text-white/80 font-medium">
              {item.pieces.length} piece set
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">

            {/* Product thumbnails — what's inside this bundle */}
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={false}
              animate={{opacity: isHovered ? 1 : 0.75, y: isHovered ? 0 : 3}}
              transition={{duration: 0.3}}
            >
              {item.pieces.map((piece, pi) => (
                <motion.div
                  key={piece.label}
                  className="relative"
                  initial={false}
                  animate={{x: isHovered ? 0 : -pi * 6}}
                  transition={{duration: 0.3, delay: pi * 0.04}}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-white/25 overflow-hidden bg-[#E8E4E0] shadow-md">
                    <img
                      src={piece.image}
                      alt={piece.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.div>
              ))}
              <motion.span
                className="text-[9px] uppercase tracking-[0.12em] text-white/60 ml-1"
                initial={false}
                animate={{opacity: isHovered ? 1 : 0}}
                transition={{duration: 0.2, delay: 0.1}}
              >
                {item.defaultSubtitle}
              </motion.span>
            </motion.div>

            <motion.h3
              className="font-serif text-lg md:text-xl text-white italic tracking-wide"
              initial={false}
              animate={{y: isHovered ? 0 : 4}}
              transition={{duration: 0.3, delay: 0.05}}
            >
              {t(item.titleKey, item.defaultTitle)}
            </motion.h3>

            <div className="flex items-center justify-between mt-2">
              <motion.div
                className="h-[1px] bg-[#D4AF87]"
                initial={{width: 24}}
                animate={{width: isHovered ? 40 : 24}}
                transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
              />
              <motion.p
                className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF87]"
                initial={false}
                animate={{opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 6}}
                transition={{duration: 0.25, delay: 0.1}}
              >
                Shop the set →
              </motion.p>
            </div>
          </div>

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
        {/* Section Header with SplitText effect */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="flex justify-between items-end mb-6"
        >
          <h2 className="font-serif text-2xl md:text-3xl italic text-brand-text">
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

        {/* Desktop: 2x2 grid — square cards, no cropping */}
        <div className="hidden md:grid md:grid-cols-2 gap-3">
          {BENTO_ITEMS.map((item, i) => (
            <motion.div
              key={item.url}
              style={shouldReduceMotion ? {} : {y: i % 2 === 0 ? leftColY : rightColY}}
            >
              <TopCard item={item} index={i} t={t} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
