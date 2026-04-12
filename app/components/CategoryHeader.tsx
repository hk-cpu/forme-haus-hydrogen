import {motion} from 'framer-motion';
import {Link, useLocation} from '@remix-run/react';

import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';

/**
 * Top-level category tabs — every collection page shows the same five tabs
 * so users can freely move between sections without getting lost.
 *
 * Active-state detection handles handle aliases (new/new-in, phone/phone-cases)
 * and locale-prefixed URLs (/ar/collections/...).
 */
const CATEGORIES = [
  {
    id: 'shop-all',
    labelKey: 'nav.shopAll',
    label: 'Shop All',
    href: '/products',
    aliases: [] as string[],
  },
  {
    id: 'new-in',
    labelKey: 'nav.newIn',
    label: 'New to Haus',
    href: '/collections/new-in',
    aliases: ['/collections/new'],
  },
  {
    id: 'phone-cases',
    labelKey: 'nav.phoneCases',
    label: 'Phone Accessories',
    href: '/collections/phone-cases',
    aliases: ['/collections/phone'],
  },
  {
    id: 'phone-straps',
    labelKey: 'nav.phoneStraps',
    label: 'Phone Straps',
    href: '/collections/phone-straps',
    aliases: [],
  },
  {
    id: 'sunglasses',
    labelKey: 'nav.sunglasses',
    label: 'Sunglasses',
    href: '/collections/sunglasses',
    aliases: [],
  },
];

interface CategoryHeaderProps {
  currentCategory: string;
  productCount?: number;
  collectionHandle?: string;
  activeFiltersCount?: number;
}

export function CategoryHeader({
  productCount,
  activeFiltersCount,
}: CategoryHeaderProps) {
  const {toggleFilter} = useUI();
  const {isRTL, t} = useTranslation();
  const location = useLocation();

  return (
    <div
      className="sticky z-40 bg-cream/[0.97] backdrop-blur-xl border-b border-brand-text/8"
      style={{top: 'var(--navbar-height)', direction: isRTL ? 'rtl' : 'ltr'}}
    >
      <div
        className="max-w-[1440px] mx-auto flex items-center justify-between"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Scrollable Tab Bar */}
        <nav
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 -mx-1"
          aria-label="Category navigation"
        >
          {CATEGORIES.map((cat) => {
            const p = location.pathname;
            const hrefs = [cat.href, ...cat.aliases];
            const isActive = hrefs.some(
              (href) => p === href || p.endsWith(href),
            );

            return (
              <Link
                key={cat.id}
                to={cat.href}
                className={`relative px-4 py-3 text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 rounded-full ${
                  isActive
                    ? 'text-brand-text font-medium'
                    : 'text-[#8B7355] hover:text-brand-text'
                }`}
              >
                {t(cat.labelKey as any, cat.label)}
                {isActive && (
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

        {/* Right: Filter button + item count */}
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
            className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-[11px] uppercase tracking-[0.12em] text-brand-text hover:text-bronze border border-brand-text/12 hover:border-bronze/30 rounded-full transition-all duration-300"
          >
            <svg
              width="14"
              height="14"
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
    </div>
  );
}

export default CategoryHeader;
