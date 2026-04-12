import {AnimatePresence, motion} from 'framer-motion';
import {Link, useLocation} from '@remix-run/react';

import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';

/**
 * Two-row sticky category navigation.
 *
 * Row 1 (always visible): New to Haus | Phone Accessories | Sunglasses
 * Row 2 (slides in on phone collections): Phone Cases | Phone Straps
 *
 * "Phone Accessories" is the active parent tab whenever the user is on
 * either phone-cases or phone-straps.
 */

const MAIN_CATEGORIES = [
  {
    id: 'new-in',
    label: 'New to Haus',
    labelKey: 'nav.newIn',
    href: '/collections/new-in',
    aliases: ['/collections/new'],
  },
  {
    id: 'phone-accessories',
    label: 'Phone Accessories',
    labelKey: 'nav.phoneCases',
    href: '/collections/phone-cases',
    // Active when on any phone sub-collection too
    aliases: ['/collections/phone', '/collections/phone-straps'],
  },
  {
    id: 'sunglasses',
    label: 'Sunglasses',
    labelKey: 'nav.sunglasses',
    href: '/collections/sunglasses',
    aliases: [],
  },
];

const PHONE_SUB_CATEGORIES = [
  {
    id: 'phone-cases',
    label: 'Phone Cases',
    labelKey: 'nav.phoneCasesOnly',
    href: '/collections/phone-cases',
    aliases: ['/collections/phone'],
  },
  {
    id: 'phone-straps',
    label: 'Phone Straps',
    labelKey: 'nav.phoneStraps',
    href: '/collections/phone-straps',
    aliases: [],
  },
];

const PHONE_HANDLES = new Set(['phone-cases', 'phone-straps', 'phone']);

interface CategoryHeaderProps {
  currentCategory: string;
  productCount?: number;
  collectionHandle?: string;
  activeFiltersCount?: number;
}

export function CategoryHeader({
  productCount,
  collectionHandle,
  activeFiltersCount,
}: CategoryHeaderProps) {
  const {toggleFilter} = useUI();
  const {isRTL, t} = useTranslation();
  const location = useLocation();

  const p = location.pathname;

  // Show phone sub-nav when on any phone-related collection
  const isPhoneCollection =
    PHONE_HANDLES.has(collectionHandle ?? '') ||
    PHONE_HANDLES.has(p.split('/').pop() ?? '');

  const isActive = (href: string, aliases: string[]) => {
    const hrefs = [href, ...aliases];
    return hrefs.some((h) => p === h || p.endsWith(h));
  };

  return (
    <div
      className="sticky z-40 bg-cream/[0.97] backdrop-blur-xl border-b border-brand-text/8"
      style={{top: 'var(--navbar-height)', direction: isRTL ? 'rtl' : 'ltr'}}
    >
      {/* ── Row 1: main category tabs ── */}
      <div
        className="max-w-[1440px] mx-auto flex items-center justify-between"
        style={{padding: '0 var(--page-gutter)'}}
      >
        <nav
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 -mx-1"
          aria-label="Category navigation"
        >
          {MAIN_CATEGORIES.map((cat) => {
            const active = isActive(cat.href, cat.aliases);
            return (
              <Link
                key={cat.id}
                to={cat.href}
                className={`relative px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 rounded-full flex items-center gap-1.5 ${
                  active
                    ? 'text-brand-text font-medium'
                    : 'text-[#8B7355] hover:text-brand-text'
                }`}
              >
                {t(cat.labelKey as any, cat.label)}
                {/* Chevron indicator for Phone Accessories */}
                {cat.id === 'phone-accessories' && (
                  <motion.svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{rotate: isPhoneCollection ? 180 : 0}}
                    transition={{duration: 0.25}}
                    className="opacity-60 shrink-0"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                )}
                {active && (
                  <motion.span
                    layoutId="category-tab-underline"
                    className="absolute inset-0 rounded-full bg-[#a87441]/8 border border-[#a87441]/15"
                    transition={{type: 'spring', stiffness: 380, damping: 30}}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Filter button + item count */}
        <div className="flex items-center gap-4 shrink-0 pl-4">
          {productCount !== undefined && (
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#8B7355] hidden sm:block">
              {productCount}{' '}
              {productCount === 1
                ? t('collection.item')
                : t('collection.items')}
            </span>
          )}
          <button
            onClick={toggleFilter}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-[11px] uppercase tracking-[0.12em] text-brand-text hover:text-bronze border border-brand-text/12 hover:border-bronze/30 rounded-full transition-all duration-300"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="8" y1="18" x2="16" y2="18" />
            </svg>
            {t('filter.title', 'Filters')}
            {activeFiltersCount && activeFiltersCount > 0 ? (
              <span className="ml-1 w-5 h-5 flex items-center justify-center bg-[#a87441] text-white text-[10px] rounded-full">
                {activeFiltersCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* ── Row 2: phone sub-categories (slides in/out) ── */}
      <AnimatePresence initial={false}>
        {isPhoneCollection && (
          <motion.div
            key="phone-subnav"
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.22, ease: [0.25, 0.1, 0.25, 1]}}
            className="overflow-hidden border-t border-[#a87441]/10"
          >
            <div
              className="max-w-[1440px] mx-auto"
              style={{padding: '0 var(--page-gutter)'}}
            >
              <nav
                className="flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide"
                aria-label="Phone accessories sub-navigation"
              >
                {/* Visual hierarchy indicator */}
                <span className="text-[#a87441]/40 text-[11px] select-none mr-1 shrink-0">
                  └
                </span>
                {PHONE_SUB_CATEGORIES.map((cat) => {
                  const active = isActive(cat.href, cat.aliases);
                  return (
                    <Link
                      key={cat.id}
                      to={cat.href}
                      className={`relative px-3.5 py-1.5 text-[10px] uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-200 rounded-full ${
                        active
                          ? 'text-[#a87441] font-medium bg-[#a87441]/8 border border-[#a87441]/20'
                          : 'text-[#8B7355] hover:text-brand-text hover:bg-brand-text/4'
                      }`}
                    >
                      {t(cat.labelKey as any, cat.label)}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryHeader;
