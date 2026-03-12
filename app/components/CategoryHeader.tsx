import {motion} from 'framer-motion';
import {Link, useLocation} from '@remix-run/react';

import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';

/**
 * Category groups — context-aware sibling navigation.
 * When viewing a phone-related collection, show phone siblings.
 * Otherwise show the top-level categories.
 */
const PHONE_HANDLES = ['phone-cases', 'phone-straps', 'case-strap-bundles'];

const TOP_LEVEL_CATEGORIES = [
  {id: 'shop-all', label: 'Shop All', href: '/collections'},
  {id: 'phone-cases', label: 'Phone Cases', href: '/collections/phone-cases'},
  {
    id: 'phone-straps',
    label: 'Phone Straps',
    href: '/collections/phone-straps',
  },
  {
    id: 'bundles',
    label: 'Bundles',
    href: '/collections/case-strap-bundles',
  },
  {id: 'sunglasses', label: 'Sunglasses', href: '/collections/sunglasses'},
  {id: 'sale', label: 'Sale', href: '/collections/sale'},
];

const PHONE_SUBCATEGORIES = [
  {
    id: 'all-phone',
    label: 'All Phone Accessories',
    href: '/collections/phone-cases',
  },
  {id: 'phone-cases', label: 'Cases', href: '/collections/phone-cases'},
  {id: 'phone-straps', label: 'Straps', href: '/collections/phone-straps'},
  {
    id: 'bundles',
    label: 'Bundles',
    href: '/collections/case-strap-bundles',
  },
];

/**
 * CategoryHeader — Sticky horizontal tab bar for collection navigation
 *
 * Replaces the old dropdown with a clean scrollable tab bar.
 * Context-aware: shows relevant siblings based on current collection.
 * Animated underline follows the active tab via framer-motion layoutId.
 */
interface CategoryHeaderProps {
  currentCategory: string;
  productCount?: number;
  collectionHandle?: string;
  activeFiltersCount?: number;
}

export function CategoryHeader({
  currentCategory,
  productCount,
  collectionHandle,
  activeFiltersCount,
}: CategoryHeaderProps) {
  const {toggleFilter} = useUI();
  const {isRTL, t} = useTranslation();
  const location = useLocation();

  // Choose context-aware category list
  const isPhoneContext =
    collectionHandle && PHONE_HANDLES.includes(collectionHandle);
  const categories = isPhoneContext
    ? PHONE_SUBCATEGORIES
    : TOP_LEVEL_CATEGORIES;

  return (
    <div
      className="sticky z-40 bg-[#F9F5F0]/[0.97] backdrop-blur-xl border-b border-[#4A3C31]/8"
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
          {categories.map((cat) => {
            const isActive =
              location.pathname === cat.href ||
              location.pathname.endsWith(cat.href);

            return (
              <Link
                key={cat.id}
                to={cat.href}
                className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 rounded-full ${
                  isActive
                    ? 'text-[#4A3C31] font-medium'
                    : 'text-[#8B7355] hover:text-[#4A3C31]'
                }`}
              >
                {cat.label}
                {/* Animated underline pill */}
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

        {/* Right: Filter + Count */}
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
            className="flex items-center gap-2 px-3.5 py-2 text-[11px] uppercase tracking-[0.12em] text-[#4A3C31] hover:text-[#a87441] border border-[#4A3C31]/12 hover:border-[#a87441]/30 rounded-full transition-all duration-300"
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
            {t('filter.filters')}
            {activeFiltersCount && activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 flex items-center justify-center bg-[#a87441] text-white text-[10px] rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryHeader;
