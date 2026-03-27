import {motion} from 'framer-motion';

import {useTranslation} from '~/hooks/useTranslation';

const BRAND_PROMISES = [
  {
    id: '1',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Curated Selection',
    titleKey: 'whyUs.curatedTitle',
    description:
      'International designers chosen for refinement and lasting design.',
    descKey: 'whyUs.curatedDesc',
  },
  {
    id: '2',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Limited Collections',
    titleKey: 'whyUs.limitedTitle',
    description:
      'Thoughtfully edited releases in carefully selected quantities.',
    descKey: 'whyUs.limitedDesc',
  },
  {
    id: '3',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="3.27 6.96 12 12.01 20.73 6.96"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="22.08"
          x2="12"
          y2="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Global Designers',
    titleKey: 'whyUs.globalTitle',
    description: 'A curated mix of emerging and established labels worldwide.',
    descKey: 'whyUs.globalDesc',
  },
  {
    id: '4',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <path
          d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Elevated Experience',
    titleKey: 'whyUs.elevatedTitle',
    description:
      'A refined journey from discovery to delivery. Free shipping across Saudi Arabia — GCC coming soon.',
    descKey: 'whyUs.elevatedDesc',
  },
];

export function WhyChooseUs() {
  const {t, isRTL} = useTranslation();

  return (
    <section
      aria-label="Brand promises"
      className="py-8 md:py-10 border-t border-b border-[#8B8076]/10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="max-w-[1200px] mx-auto"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Section Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-8"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-[#4A3C31] mb-2">
            {t('whyUs.title', 'Why Choose Us')}
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent mx-auto" />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {BRAND_PROMISES.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#a87441]/20 text-[#a87441] border border-[#a87441]/15 mb-3 group-hover:bg-[#a87441] group-hover:text-white group-hover:border-[#a87441] transition-all duration-300 shadow-sm">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm md:text-base font-medium text-[#4A3C31] mb-1">
                {t(item.titleKey, item.title)}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-[#5C5046] leading-relaxed break-words">
                {t(item.descKey, item.description)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
