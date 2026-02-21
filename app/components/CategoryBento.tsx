import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {useTranslation} from '~/hooks/useTranslation';

interface Category {
  id: number;
  title: string;
  titleAr: string;
  image: string;
  url: string;
  isActive: boolean;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'New In',
    titleAr: 'وصل حديثاً',
    image: '/brand/silk-texture.png',
    url: '/collections/new-in',
    isActive: true,
  },
  {
    id: 2,
    title: 'Phone Cases',
    titleAr: 'حافظات الهاتف',
    image: '/brand/placeholder-drape.png',
    url: '/collections/phone-cases',
    isActive: true,
  },
  {
    id: 3,
    title: 'Sunglasses',
    titleAr: 'نظارات شمسية',
    image: '/brand/atelier-mood.png',
    url: '/collections/sunglasses',
    isActive: true,
  },
  {
    id: 5,
    title: 'Accessories',
    titleAr: 'إكسسوارات',
    image: '/brand/silk-texture.png',
    url: '/collections/accessories',
    isActive: false,
  },
  {
    id: 6,
    title: 'Bags',
    titleAr: 'حقائب',
    image: '/brand/journal-identity.png',
    url: '/collections/bags-e',
    isActive: false,
  },
  {
    id: 7,
    title: 'Shoes',
    titleAr: 'أحذية',
    image: '/brand/journal-hero.png',
    url: '/collections/shoes',
    isActive: false,
  },
  {
    id: 9,
    title: 'Sale',
    titleAr: 'تخفيضات',
    image: '/brand/silk-texture.png',
    url: '/collections/sale',
    isActive: false,
  },
  {
    id: 10,
    title: 'Dresses',
    titleAr: 'فساتين',
    image: '/brand/placeholder-drape.png',
    url: '/collections/dresses',
    isActive: false,
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

function CategoryCard({category, isRTL}: {category: Category; isRTL: boolean}) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative group aspect-square overflow-hidden rounded-lg"
    >
      <Link
        to={category.isActive ? category.url : '#'}
        className={`block w-full h-full ${
          !category.isActive ? 'pointer-events-none' : ''
        }`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
          <img
            src={category.image}
            alt={isRTL ? category.titleAr : category.title}
            className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
              category.isActive
                ? 'opacity-60 group-hover:opacity-80 group-hover:scale-110'
                : 'opacity-40 blur-md scale-105'
            }`}
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Coming Soon Overlay */}
        {!category.isActive && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <span className="font-serif text-xl italic text-white/90 tracking-wide">
              {isRTL ? 'قريباً' : 'Coming Soon'}
            </span>
          </div>
        )}

        {/* Content */}
        {category.isActive && (
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <motion.div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-lg md:text-xl font-serif mb-1 transition-all duration-500 text-[#F0EAE6] blur-0 group-hover:text-[#D4AF87]">
                {isRTL ? category.titleAr : category.title}
              </h3>
              <div className="h-px w-0 group-hover:w-12 bg-[#D4AF87] transition-all duration-500" />
            </motion.div>

            {/* Hover Arrow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white"
                >
                  <path
                    d={
                      isRTL
                        ? 'M19 12H5M12 19l-7-7 7-7'
                        : 'M5 12h14M12 5l7 7-7 7'
                    }
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

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
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} isRTL={isRTL} />
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
