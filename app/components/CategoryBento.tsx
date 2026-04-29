import {motion} from 'framer-motion';

import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

interface Category {
  id: number;
  titleKey: string;
  image: string;
  url: string;
  width: number;
  height: number;
  count: string;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    titleKey: 'category.newInHaus',
    image: '/brand/new-in-opt.webp',
    url: '/collections/new-in',
    width: 640,
    height: 1160,
    count: '24 Pieces',
  },
  {
    id: 2,
    titleKey: 'category.phoneAccessories',
    image: '/brand/phone-accessories-opt.webp',
    url: '/collections/phone-accessories',
    width: 640,
    height: 954,
    count: '60 Pieces',
  },
  {
    id: 4,
    titleKey: 'nav.sunglasses',
    image: '/brand/sunglasses-opt.webp',
    url: '/collections/sunglasses',
    width: 640,
    height: 1160,
    count: '16 Pieces',
  },
];

export default function CategoryBento() {
  const {isRTL, t} = useTranslation();

  return (
    <section
      aria-label="Categories"
      className="border-b border-[#8B8076]/10 pb-6 md:pb-8"
    >
      <div
        className="mx-auto max-w-[var(--container-max)]"
        style={{padding: '0 var(--page-gutter)'}}
      >
        <div className="mb-4 md:mb-5">
          <h2 className="mb-2 font-serif text-2xl text-brand-text md:text-3xl">
            {t('home.shopByCategory')}
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-[#a87441] to-transparent" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Link
                to={category.url}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#2a2118] shadow-[0_4px_20px_rgba(168,116,65,0.15),0_1px_3px_rgba(0,0,0,0.08)] transition-shadow duration-400 border border-transparent group-hover:border-[#D4AF87]/40"
              >
                <img
                  src={category.image}
                  alt={t(category.titleKey)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  width={category.width}
                  height={category.height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

                <div className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur-md transition-colors duration-300 group-hover:border-[#D4AF87] group-hover:bg-[#D4AF87] md:h-14 md:w-14">
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
        </div>

        <div className="mt-8 text-center md:mt-10">
          <Link
            to="/collections/all"
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
        </div>
      </div>
    </section>
  );
}
