import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';

import {useTranslation} from '~/hooks/useTranslation';

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
 * TopCard — renders at natural image height (flex-shrink: 0).
 * The image dictates how tall this cell is.
 */
function TopCard({item, index}: {item: BentoItem; index: number}) {
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
    >
      <Link to={item.url} className="block">
        <img
          src={item.image}
          alt={item.alt}
          className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-105"
          loading={index < 2 ? 'eager' : 'lazy'}
        />

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Content — revealed on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <h3 className="font-serif text-lg md:text-xl text-white italic tracking-wide">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-xs text-white/70 tracking-wide mt-1">
              {item.subtitle}
            </p>
          )}
          <div className="mt-2 h-[1px] w-8 bg-[#D4AF87]" />
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 rounded-[14px] border border-white/0 group-hover:border-white/15 transition-colors duration-500 pointer-events-none" />
      </Link>
    </motion.div>
  );
}

/**
 * BottomCard — fills remaining column space via flex: 1.
 * Image uses object-fit: cover + object-position: center
 * so it fills the space while keeping focal point centered.
 */
function BottomCard({item, index}: {item: BentoItem; index: number}) {
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
    >
      <Link to={item.url} className="block w-full h-full">
        <img
          src={item.image}
          alt={item.alt}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Content — revealed on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <h3 className="font-serif text-lg md:text-xl text-white italic tracking-wide">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-xs text-white/70 tracking-wide mt-1">
              {item.subtitle}
            </p>
          )}
          <div className="mt-2 h-[1px] w-8 bg-[#D4AF87]" />
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 rounded-[14px] border border-white/0 group-hover:border-white/15 transition-colors duration-500 pointer-events-none" />
      </Link>
    </motion.div>
  );
}

export default function EditorialSection() {
  const {isRTL} = useTranslation();

  return (
    <section
      aria-label="Editorial"
      className="py-6 md:py-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="max-w-[1200px] mx-auto"
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
            The Edit
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
          Desktop: flexbox two-column editorial grid
          Each column: top image at natural height + bottom image fills remaining space.
          The stagger comes from different top-image heights in each column.
        */}
        <div className="hidden md:flex gap-3" style={{minHeight: '750px'}}>
          {/* Left column */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <TopCard item={BENTO_ITEMS[0]} index={0} />
            <BottomCard item={BENTO_ITEMS[2]} index={2} />
          </div>

          {/* Right column */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <TopCard item={BENTO_ITEMS[1]} index={1} />
            <BottomCard item={BENTO_ITEMS[3]} index={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
