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
        className="h-6 w-6"
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
        className="h-6 w-6"
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
        className="h-6 w-6"
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
        className="h-6 w-6"
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
      'A refined journey from discovery to delivery. Free shipping across Saudi Arabia.',
    descKey: 'whyUs.elevatedDesc',
  },
];

export function WhyChooseUs() {
  const {t, isRTL} = useTranslation();

  return (
    <section
      aria-label="Brand promises"
      className="border-y border-[#8B8076]/10 py-8 md:py-10"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="mx-auto max-w-[1200px]"
        style={{padding: '0 var(--page-gutter)'}}
      >
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-serif text-2xl text-[#4A3C31] md:text-3xl">
            {t('whyUs.title', 'Why Choose Us')}
          </h2>
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent mb-5" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a87441]/20 bg-[#a87441]/5 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-[#a87441]">
              {t('whyUs.badgeShipping', 'Free Shipping Across KSA')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a87441]/20 bg-[#a87441]/5 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-[#a87441]">
              {t('whyUs.badgeReturns', '7-Day Easy Returns')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {BRAND_PROMISES.map((item) => (
            <div key={item.id} className="text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#a87441]/15 bg-[linear-gradient(135deg,rgba(168,116,65,0.3),rgba(212,175,135,0.15))] text-[#a87441] shadow-sm">
                {item.icon}
              </div>
              <h3 className="mb-1 font-serif italic text-sm text-[#4A3C31] md:text-base">
                {t(item.titleKey, item.title)}
              </h3>
              <p className="break-words font-serif italic text-xs leading-relaxed text-[#5C5046] md:text-sm">
                {t(item.descKey, item.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
