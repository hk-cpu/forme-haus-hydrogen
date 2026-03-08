import {useState} from 'react';
import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';

import {useTranslation} from '~/hooks/useTranslation';

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
    image: '/brand/new-in.webp',
    blurImage: '/brand/new-in-blur.webp',
    url: '/collections/new-in',
    isActive: true,
  },
  {
    id: 2,
    title: 'Phone Accessories',
    titleAr: 'إكسسوارات الهاتف',
    image: '/brand/phone-accessories.webp',
    blurImage: '/brand/phone-accessories-blur.webp',
    url: '/collections/phone-cases',
    isActive: true,
  },
  {
    id: 3,
    title: 'Sunglasses',
    titleAr: 'نظارات شمسية',
    image: '/brand/sunglasses.webp',
    blurImage: '/brand/sunglasses-blur.webp',
    url: '/collections/sunglasses',
    isActive: true,
  },
];

const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {opacity: 0, y: 40},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function CategoryCard({category, isRTL, index}: {category: Category; isRTL: boolean; index: number}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="relative group aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl bg-[#2a2118]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={category.url} className="block w-full h-full">
        {/* Full-bleed background image - no white overlay */}
        {!imageError ? (
          <img
            src={category.image}
            alt={isRTL ? category.titleAr : category.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
            <span className="text-[#8B8076] text-xs uppercase tracking-wider">
              {isRTL ? category.titleAr : category.title}
            </span>
          </div>
        )}
        
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2118] to-[#1A1A1A] animate-pulse" />
        )}

        {/* Elegant gradient overlay - darker at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Subtle vignette */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
          }}
        />

        {/* Content - positioned at bottom left */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10 pointer-events-none">
          <motion.div 
            className="transform transition-transform duration-500"
            initial={false}
            animate={{y: isHovered ? -4 : 0}}
          >
            <h3 className="text-xl md:text-2xl font-serif text-white mb-2 tracking-wide">
              {isRTL ? category.titleAr : category.title}
            </h3>
            <motion.div 
              className="h-[1px] bg-[#D4AF87] origin-left"
              initial={{width: 0}}
              animate={{width: isHovered ? 48 : 0}}
              transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            />
          </motion.div>
        </div>

        {/* Hover Arrow - centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md bg-black/20"
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8}}
            transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
              <path d={isRTL ? 'M19 12H5M12 19l-7-7 7-7' : 'M5 12h14M12 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Scale effect on hover */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{scale: isHovered ? 1.05 : 1}}
          transition={{duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
          style={{
            background: isHovered ? 'rgba(168, 116, 65, 0.05)' : 'transparent'
          }}
        />
      </Link>
    </motion.div>
  );
}

export default function CategoryBento() {
  const {isRTL, t} = useTranslation();

  return (
    <section className="pb-10 md:pb-14 border-b border-[#8B8076]/10">
      <div className="max-w-[1200px] mx-auto" style={{padding: '0 var(--page-gutter)'}}>
        {/* Section Header */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="mb-6 md:mb-8"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] mb-3">
            {isRTL ? 'تسوّق حسب الفئة' : t('home.categorySlider')}
          </h2>
          <div className="h-px w-20 bg-gradient-to-r from-[#a87441] to-transparent" />
        </motion.div>

        {/* Bento Grid - equal gaps all sides */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, margin: "-100px"}}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
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
          className="mt-8 md:mt-10 text-center"
        >
          <Link
            to="/collections"
            className="inline-flex items-center gap-3 px-7 py-3.5 min-h-[48px] border border-[#a87441]/25 text-[#a87441] hover:bg-[#a87441] hover:text-white transition-all duration-500 rounded-full text-[11px] uppercase tracking-[0.2em] group"
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
