import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from '@remix-run/react';
import { useUI } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

// Icons
const Icons = {
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  List: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  ),
};

// Sibling categories data
const siblingCategories = [
  { id: 'all', label: 'All Ready-to-Wear', href: '/collections/all' },
  { id: 'dresses', label: 'Dresses', href: '/collections/dresses' },
  { id: 'tops', label: 'Tops', href: '/collections/tops' },
  { id: 'blazers', label: 'Blazers', href: '/collections/blazers' },
  { id: 'pants', label: 'Pants', href: '/collections/pants' },
  { id: 'skirts', label: 'Skirts', href: '/collections/skirts' },
  { id: 'outerwear', label: 'Outerwear', href: '/collections/outerwear' },
  { id: 'knitwear', label: 'Knitwear', href: '/collections/knitwear' },
  { id: 'activewear', label: 'Activewear', href: '/collections/activewear' },
];

/**
 * CategoryHeader - Sticky sub-header for collection pages
 * 
 * Features:
 * - Sticky below main header
 * - Left: Category dropdown (sibling categories)
 * - Right: "Filters" button
 * - Dark luxury theme
 */
export function CategoryHeader({
  currentCategory,
  productCount,
}: {
  currentCategory: string;
  productCount?: number;
}) {
  const { toggleFilter } = useUI();
  const { isRTL, t } = useTranslation();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeCategory = siblingCategories.find(
    (cat) => cat.href === location.pathname
  ) || { id: 'all', label: currentCategory, href: location.pathname };

  return (
    <div
      className="sticky top-[73px] z-40 bg-[#121212] border-b border-[#a87441]/20"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-[#F0EAE6] hover:text-[#a87441] transition-colors group"
          >
            <span className="font-serif text-lg">{activeCategory.label}</span>
            {productCount !== undefined && (
              <span className="text-[#AA9B8F] text-sm">({productCount})</span>
            )}
            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#AA9B8F] group-hover:text-[#a87441]"
            >
              <Icons.ChevronDown />
            </motion.span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <motion.div
                  className="absolute top-full left-0 mt-2 bg-[#1A1A1A] border border-[#a87441]/20 rounded-lg min-w-[240px] shadow-2xl z-20 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-2">
                    {siblingCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={cat.href}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          cat.href === location.pathname
                            ? 'text-[#a87441] bg-[#a87441]/10'
                            : 'text-[#F0EAE6] hover:bg-[#a87441]/10 hover:text-[#a87441]'
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Filter Button */}
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 px-4 py-2 bg-[#a87441]/10 hover:bg-[#a87441]/20 rounded-lg text-[#F0EAE6] transition-colors"
        >
          <Icons.Filter />
          <span className="text-sm font-medium">{t('filter.filters', 'Filters')}</span>
        </button>
      </div>
    </div>
  );
}

export default CategoryHeader;
