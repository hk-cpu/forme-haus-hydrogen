import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';

import {useTranslation} from '~/hooks/useTranslation';
import {BlurRevealImage} from '~/components/BlurRevealImage';

interface Category {
  id: number;
  title: string;
  titleAr: string;
  image: string;
  blurImage: string;
  url: string;
  isActive: boolean;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'New In',
    titleAr: 'وصل حديثاً',
    image: '/brand/new-in.png',
    blurImage: '/brand/new-in-blur.png',
    url: '/collections/new-in',
    isActive: true,
  },
  {
    id: 2,
    title: 'Phone Cases',
    titleAr: 'حافظات الهاتف',
    image: '/brand/phone-accessories.webp',
    blurImage: '/brand/phone-accessories-blur.png',
    url: '/collections/phone-cases',
    isActive: true,
  },
  {
    id: 3,
    title: 'Sunglasses',
    titleAr: 'نظارات شمسية',
    image: '/brand/sunglasses.webp',
    blurImage: '/brand/sunglasses-blur.png',
    url: '/collections/sunglasses',
    isActive: true,
  },
];

const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function CategoryCard({category, isRTL, index}: {category: Category; isRTL: boolean; index: number}) {
  // Stagger the breathing duration so cards don't pulse in sync
  const breatheDurations = [5, 5.8, 6.6];

  return (
    <motion.div
      variants={itemVariants}
      className="relative group aspect-[3/4] overflow-hidden rounded-lg"
    >
      <Link to={category.url} className="block w-full h-full">
        {/* Background: BlurReveal camera-focus effect */}
        <BlurRevealImage
          src={category.image}
          blurSrc={category.blurImage}
          alt={isRTL ? category.titleAr : category.title}
          className="absolute inset-0 w-full h-full"
          breatheDuration={breatheDurations[index % breatheDurations.length]}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
          <motion.div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-lg md:text-xl font-serif mb-1 transition-all duration-500 text-[#F0EAE6] group-hover:text-[#D4AF87]">
              {isRTL ? category.titleAr : category.title}
            </h3>
            <div className="h-px w-0 group-hover:w-12 bg-[#D4AF87] transition-all duration-500" />
          </motion.div>

          {/* Hover Arrow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                <path d={isRTL ? 'M19 12H5M12 19l-7-7 7-7' : 'M5 12h14M12 5l7 7-7 7'} />
              </svg>
            </div>
          </div>
        </div>

        {/* Border Glow on Hover */}
        <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-[#D4AF87]/20 transition-colors duration-500 pointer-events-none" />
      </Link>
    </motion.div>
  );
}

export default function CategoryBento() {
  const {isRTL, t} = useTranslation();

  return (
    <section className="pb-16 md:pb-24 border-b border-[#8B8076]/10">
      <div className="max-w-[1200px] mx-auto" style={{padding: '0 var(--page-gutter)'}}>
        {/* Section Header */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="mb-10 md:mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] mb-3">
            {isRTL ? 'تسوّق حسب الفئة' : t('home.categorySlider')}
          </h2>
          <div className="h-px w-20 bg-gradient-to-r from-[#a87441] to-transparent" />
        </motion.div>

        {/* Bento Grid — equal gaps all sides */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true}}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {CATEGORIES.map((category, i) => (
            <CategoryCard key={category.id} category={category} isRTL={isRTL} index={i} />
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{delay: 0.4}}
          className="mt-10 md:mt-12 text-center"
        >
          <Link
            to="/collections"
            className="inline-flex items-center gap-3 px-7 py-3.5 border border-[#a87441]/25 text-[#a87441] hover:bg-[#a87441] hover:text-white transition-all duration-500 rounded-full text-[11px] uppercase tracking-[0.2em] group"
          >
            <span>{isRTL ? 'عرض الكل' : t('general.viewAll')}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transform transition-transform duration-300 ${
                isRTL
                  ? 'group-hover:-translate-x-1'
                  : 'group-hover:translate-x-1'
              }`}
            >
              <path
                d={isRTL ? 'M19 12H5M12 19l-7-7 7-7' : 'M5 12h14M12 5l7 7-7 7'}
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
