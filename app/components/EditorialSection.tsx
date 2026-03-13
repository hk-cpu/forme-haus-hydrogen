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

// 4 images — staggered masonry mapped to brand editorial shots
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

function BentoCard({
  item,
  index,
  className = '',
}: {
  item: BentoItem;
  index: number;
  className?: string;
}) {
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
      className={`group relative overflow-hidden rounded-[14px] bg-[#E8E4E0] ${className}`}
    >
      <Link to={item.url} className="block w-full h-full">
        <img
          src={item.image}
          alt={item.alt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076] py-2 inline-flex items-center min-h-[44px]">
            Editorial
          </span>
        </motion.div>

        {/* Mobile: single column stack */}
        <div className="flex flex-col gap-3 md:hidden">
          <BentoCard
            item={BENTO_ITEMS[0]}
            index={0}
            className="aspect-[17/10]"
          />
          <BentoCard
            item={BENTO_ITEMS[1]}
            index={1}
            className="aspect-[1/2]"
          />
          <BentoCard
            item={BENTO_ITEMS[2]}
            index={2}
            className="aspect-[11/10]"
          />
          <BentoCard
            item={BENTO_ITEMS[3]}
            index={3}
            className="aspect-[3/2]"
          />
        </div>

        {/*
          Desktop: staggered two-column masonry
          Each cell uses aspect-ratio matching the original image proportions
          so object-fit: cover shows the full image with zero cropping.

          Left col (~62.5%): Driving 17:10 + Veil 11:10
          Right col (~37.5%): Walking 1:2 + Pool 3:2
          The stagger happens naturally — right col splits lower than left.
        */}
        <div
          className="hidden md:grid gap-3"
          style={{gridTemplateColumns: '5fr 3fr'}}
        >
          {/* Left column */}
          <div className="flex flex-col gap-3">
            <BentoCard
              item={BENTO_ITEMS[0]}
              index={0}
              className="aspect-[17/10]"
            />
            <BentoCard
              item={BENTO_ITEMS[2]}
              index={2}
              className="aspect-[11/10]"
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3">
            <BentoCard
              item={BENTO_ITEMS[1]}
              index={1}
              className="aspect-[1/2]"
            />
            <BentoCard
              item={BENTO_ITEMS[3]}
              index={3}
              className="aspect-[3/2]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
