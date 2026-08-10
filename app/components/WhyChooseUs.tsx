import type {ReactNode} from 'react';

import {useTranslation} from '~/hooks/useTranslation';

const BRAND_PROMISES: (BrandPromise & {icon: ReactNode})[] = [
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
    iconKey: 'shield',
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
    iconKey: 'sparkle',
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
    iconKey: 'globe',
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
    iconKey: 'gem',
    title: 'Elevated Experience',
    titleKey: 'whyUs.elevatedTitle',
    description:
      'A refined journey from discovery to delivery. Free shipping across Saudi Arabia.',
    descKey: 'whyUs.elevatedDesc',
  },
];

/**
 * Icons are inline SVG, so they can't live in Admin. Each entry instead stores
 * a stable key ("shield", "sparkle", "globe", "gem") and the artwork is looked
 * up here. An unrecognised key falls back to the first icon rather than
 * rendering an empty circle.
 */
const ICON_BY_KEY: Record<string, ReactNode> = Object.fromEntries(
  BRAND_PROMISES.map((promise) => [promise.iconKey, promise.icon]),
);

export interface BrandPromise {
  id: string;
  iconKey: string;
  /** English defaults, used when Admin has no value and no translation exists. */
  title: string;
  description: string;
  /** Translation-file fallback for the four original promises. */
  titleKey?: string;
  descKey?: string;
  /** Copy managed in Shopify Admin — wins over the translation key. */
  titleEn?: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

/**
 * Order: the entry's own Admin value for this language, then the translation
 * key, then the English default. An empty Admin field is skipped rather than
 * rendered.
 */
function resolveCopy(
  adminValue: string | undefined,
  key: string | undefined,
  fallback: string,
  t: (k: string, d?: string) => string,
): string {
  if (adminValue) return adminValue;
  if (key) return t(key, fallback);
  return fallback;
}

export function WhyChooseUs({promises}: {promises?: BrandPromise[]}) {
  const {t, isRTL, lang} = useTranslation();
  const items = promises?.length ? promises : BRAND_PROMISES;

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
          {items.map((item) => (
            <div key={item.id} className="text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#a87441]/15 bg-[linear-gradient(135deg,rgba(168,116,65,0.3),rgba(212,175,135,0.15))] text-[#a87441] shadow-sm">
                {ICON_BY_KEY[item.iconKey] ?? ICON_BY_KEY.shield}
              </div>
              <h3 className="mb-1 font-serif italic text-sm text-[#4A3C31] md:text-base">
                {resolveCopy(
                  lang === 'AR' ? item.titleAr : item.titleEn,
                  item.titleKey,
                  item.title,
                  t,
                )}
              </h3>
              <p className="break-words font-serif italic text-xs leading-relaxed text-[#5C5046] md:text-sm">
                {resolveCopy(
                  lang === 'AR' ? item.descriptionAr : item.descriptionEn,
                  item.descKey,
                  item.description,
                  t,
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
