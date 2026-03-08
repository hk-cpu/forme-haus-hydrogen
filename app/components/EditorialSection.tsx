import {useState} from 'react';
import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {useTranslation} from '~/hooks/useTranslation';

interface EditorialItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  url: string;
  size: 'large' | 'medium' | 'small';
}

const EDITORIAL_ITEMS: EditorialItem[] = [
  {
    id: '1',
    title: 'Modern Essentials',
    subtitle: 'Timeless pieces for everyday elegance',
    image: '/brand/edit-modern-essentials.webp',
    url: '/collections/new-in',
    size: 'large',
  },
  {
    id: '2',
    title: 'Sun Ready',
    subtitle: 'For golden hours',
    image: '/brand/edit-sun-ready.webp',
    url: '/collections/sunglasses',
    size: 'medium',
  },
  {
    id: '3',
    title: 'Carry It Your Way',
    subtitle: 'Hands-free style',
    image: '/brand/edit-carry.webp',
    url: '/collections/phone-cases',
    size: 'medium',
  },
  {
    id: '4',
    title: 'New Arrivals',
    subtitle: 'Latest from the Haus',
    image: '/brand/edit-new-arrivals.webp',
    url: '/collections/new-in',
    size: 'small',
  },
];

// Editorial Card Component
function EditorialCard({
  item,
  index,
  className = '',
}: {
  item: EditorialItem;
  index: number;
  className?: string;
}) {
  const {isRTL} = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1]}}
      className={`group relative overflow-hidden rounded-2xl bg-[#2a2118] ${className}`}
    >
      <Link to={item.url} className="block w-full h-full">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.title}
              className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index < 2 ? 'eager' : 'lazy'}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : null}

          {/* Loading skeleton / fallback */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a2118] to-[#1A1A1A] animate-pulse" />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <motion.div
            initial={false}
            animate={{y: 0}}
            className="transform transition-transform duration-500"
          >
            <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-white mb-2 italic tracking-wide">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-sm text-white/70 tracking-wide mb-3">
                {item.subtitle}
              </p>
            )}
            <motion.div
              className="h-[1px] bg-[#D4AF87] origin-left"
              initial={{width: 0}}
              whileInView={{width: 40}}
              viewport={{once: true}}
              transition={{delay: 0.3 + index * 0.1, duration: 0.5}}
            />
          </motion.div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#a87441]/0 group-hover:bg-[#a87441]/10 transition-colors duration-500" />

        {/* Border on hover */}
        <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors duration-500" />
      </Link>
    </motion.div>
  );
}

export default function EditorialSection() {
  const {isRTL, t} = useTranslation();

  return (
    <section className="py-8 md:py-12" dir={isRTL ? 'rtl' : 'ltr'}>
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
          className="flex justify-between items-end mb-8"
        >
          <h2 className="font-serif text-3xl md:text-4xl italic text-[#4A3C31]">
            The Edit
          </h2>
          <Link
            to="/journal"
            className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076] hover:text-[#a87441] transition-colors duration-300 py-3 inline-flex items-center min-h-[44px]"
          >
            View All Stories
          </Link>
        </motion.div>

        {/* Editorial Grid - Asymmetric Magazine Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* Large Feature - Left (spans 7 cols, full height) */}
          <div className="md:col-span-7 md:row-span-2">
            <EditorialCard
              item={EDITORIAL_ITEMS[0]}
              index={0}
              className="aspect-[4/5] md:aspect-auto md:h-full min-h-[400px] md:min-h-[600px]"
            />
          </div>

          {/* Medium - Top Right (spans 5 cols) */}
          <div className="md:col-span-5">
            <EditorialCard
              item={EDITORIAL_ITEMS[1]}
              index={1}
              className="aspect-[16/10] md:aspect-[4/3]"
            />
          </div>

          {/* Medium - Bottom Right (spans 5 cols) */}
          <div className="md:col-span-5">
            <EditorialCard
              item={EDITORIAL_ITEMS[2]}
              index={2}
              className="aspect-[16/10] md:aspect-[4/3]"
            />
          </div>
        </div>

        {/* Secondary Row - 3 smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mt-4 md:mt-5">
          <EditorialCard
            item={EDITORIAL_ITEMS[3]}
            index={3}
            className="aspect-[4/3]"
          />
          {/* Additional editorial items can be added here */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.4, duration: 0.6}}
            className="relative overflow-hidden rounded-2xl aspect-[4/3] group"
          >
            <Link to="/collections" className="block w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#a87441]/20 to-[#8B5E3C]/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <span className="font-serif text-2xl md:text-3xl text-[#4A3C31] italic mb-2">
                  View All
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8B8076]">
                  Collections
                </span>
                <motion.div className="mt-4 w-10 h-10 rounded-full border border-[#a87441]/30 flex items-center justify-center group-hover:bg-[#a87441] group-hover:text-white transition-all duration-300">
                  <svg
                    width="16"
                    height="16"
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
                </motion.div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.5, duration: 0.6}}
            className="relative overflow-hidden rounded-2xl aspect-[4/3] group"
          >
            <img
              src="/brand/journal-wardrobe.webp"
              alt="Journal"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <Link
              to="/journal"
              className="absolute inset-0 flex flex-col justify-end p-6"
            >
              <span className="font-serif text-xl md:text-2xl text-white italic">
                Journal
              </span>
              <span className="text-sm text-white/70 mt-1">
                Stories & Inspiration
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
