import {motion, useReducedMotion} from 'framer-motion';

import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

interface Category {
  id: number;
  titleKey: string;
  image: string;
  url: string;
  width: number;
  height: number;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    titleKey: 'category.newInHaus',
    image: '/brand/new-in-opt.webp',
    url: '/collections/new-in',
    width: 640,
    height: 1160,
  },
  {
    id: 2,
    titleKey: 'category.phoneAccessories',
    image: '/brand/phone-accessories-opt.webp',
    url: '/collections/phone-cases',
    width: 640,
    height: 954,
  },
  {
    id: 3,
    titleKey: 'nav.sunglasses',
    image: '/brand/sunglasses-opt.webp',
    url: '/collections/sunglasses',
    width: 640,
    height: 1160,
  },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;

const gridVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {staggerChildren: 0.12, delayChildren: 0.05},
  },
};

const cardVariants = {
  hidden: {opacity: 0, y: 28},
  visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: EASE}},
};

export default function CategoryBento() {
  const {isRTL, t} = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Categories"
      className="border-b border-[#8B8076]/10 pb-6 md:pb-8"
    >
      <div
        className="mx-auto max-w-[var(--container-max)]"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Section header */}
        <motion.div
          className="mb-4 md:mb-5"
          initial={prefersReducedMotion ? false : {opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.5}}
          transition={{duration: 0.5, ease: EASE}}
        >
          <h2 className="mb-2 font-serif text-2xl text-[#4A3C31] md:text-3xl">
            {t('home.shopByCategory')}
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-[#a87441] to-transparent" />
        </motion.div>

        {/* Cards grid — staggered reveal */}
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
          variants={prefersReducedMotion ? {} : gridVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{once: true, amount: 0.15}}
        >
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              variants={prefersReducedMotion ? {} : cardVariants}
            >
              <Link
                to={category.url}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#2a2118]"
              >
                <img
                  src={category.image}
                  alt={t(category.titleKey)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  width={category.width}
                  height={category.height}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                  }}
                />

                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="mb-2 font-serif text-xl tracking-wide text-white md:text-2xl">
                    {t(category.titleKey)}
                  </h3>
                  <div
                    className={`h-[1px] bg-[#D4AF87] transition-all duration-300 ${
                      isRTL
                        ? 'origin-right group-hover:w-12 w-6'
                        : 'origin-left group-hover:w-12 w-6'
                    }`}
                  />
                </div>

                <div className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur-md md:h-14 md:w-14">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-white transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  >
                    <path
                      d={
                        isRTL
                          ? 'M19 12H5M12 19l-7-7 7-7'
                          : 'M5 12h14M12 5l7 7-7 7'
                      }
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 text-center md:mt-10"
          initial={prefersReducedMotion ? false : {opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true, amount: 1}}
          transition={{duration: 0.5, delay: 0.3, ease: EASE}}
        >
          <Link
            to="/products"
            className="inline-flex min-h-[48px] items-center gap-3 rounded-full border border-[#a87441]/25 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#a87441] transition-all duration-300 hover:bg-[#a87441] hover:text-white"
          >
            <span>{t('general.viewAll')}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-transform duration-300 ${
                isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'
              }`}
            >
              <path
                d={isRTL ? 'M19 12H5M12 19l-7-7 7-7' : 'M5 12h14M12 5l7 7-7 7'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
