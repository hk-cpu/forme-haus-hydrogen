import {useState, useEffect} from 'react';
import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {useTranslation} from '~/hooks/useTranslation';

interface EditorialItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  url: string;
}

const EDITORIAL_ITEMS: EditorialItem[] = [
  {
    id: '1',
    title: 'Modern Essentials',
    subtitle: 'Timeless pieces for everyday elegance',
    image: '/brand/edit-modern-essentials.webp',
    url: '/collections/new-in',
  },
  {
    id: '2',
    title: 'Sun Ready',
    subtitle: 'For golden hours',
    image: '/brand/edit-sun-ready.webp',
    url: '/collections/sunglasses',
  },
  {
    id: '3',
    title: 'Carry It Your Way',
    subtitle: 'Hands-free style',
    image: '/brand/edit-carry.webp',
    url: '/collections/phone-cases',
  },
  {
    id: '4',
    title: 'New Arrivals',
    subtitle: 'Latest from the Haus',
    image: '/brand/edit-new-arrivals.webp',
    url: '/collections/new-in',
  },
  {
    id: '5',
    title: 'The Journal',
    subtitle: 'Stories & Inspiration',
    image: '/brand/journal-wardrobe.webp',
    url: '/journal',
  },
];

// Editorial Card Component
function EditorialCard({
  item,
  index,
}: {
  item: EditorialItem;
  index: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1]}}
      className="group relative overflow-hidden rounded-2xl bg-[#E8E4E0] aspect-[3/4]"
    >
      <Link to={item.url} className="block w-full h-full">
        {/* Image Container - All same aspect, zoomed to hide watermark */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{
              opacity: mounted && !imageLoaded ? 0 : 1,
              transform: 'scale(1.15)',
              transformOrigin: 'center center',
            }}
            loading={index < 2 ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
          />

          {mounted && !imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8E4E0] to-[#D8D4D0] animate-pulse" />
          )}
        </div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.2)] pointer-events-none" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3 className="font-serif text-lg md:text-xl text-white mb-1 italic tracking-wide">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-xs md:text-sm text-white/70 tracking-wide mb-2">
              {item.subtitle}
            </p>
          )}
          <motion.div
            className="h-[1px] bg-[#D4AF87] origin-left"
            initial={{width: 0}}
            whileInView={{width: 30}}
            viewport={{once: true}}
            transition={{delay: 0.3 + index * 0.1, duration: 0.5}}
          />
        </div>

        {/* Hover effects */}
        <div className="absolute inset-0 bg-[#a87441]/0 group-hover:bg-[#a87441]/10 transition-colors duration-500 pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none" />
      </Link>
    </motion.div>
  );
}

// Simple CTA Card
function CTACard() {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{delay: 0.4, duration: 0.6}}
      className="relative overflow-hidden rounded-2xl aspect-[3/4] group bg-gradient-to-br from-[#F5F2ED] to-[#E8E4E0]"
    >
      <Link to="/collections" className="block w-full h-full">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="font-serif text-xl md:text-2xl text-[#4A3C31] italic mb-1">
            View All
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#8B8076]">
            Collections
          </span>
          <div className="mt-3 w-8 h-8 rounded-full border border-[#a87441]/30 flex items-center justify-center group-hover:bg-[#a87441] group-hover:text-white transition-all duration-300">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#a87441] group-hover:text-white"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function EditorialSection() {
  const {isRTL, t} = useTranslation();

  return (
    <section className="py-6 md:py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        className="max-w-[1400px] mx-auto"
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
          <span
            className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076] py-2 inline-flex items-center min-h-[44px]"
          >
            Editorial
          </span>
        </motion.div>

        {/* 3x2 Grid - 6 cards total */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {EDITORIAL_ITEMS.map((item, index) => (
            <EditorialCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
          <CTACard />
        </div>
      </div>
    </section>
  );
}
