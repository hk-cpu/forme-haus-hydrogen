import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

// Icons
const Icons = {
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  Sliders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  ),
};

// Filter options
const filterData = {
  categories: [
    { id: 'dresses', label: 'Dresses', count: 48 },
    { id: 'tops', label: 'Tops & Blouses', count: 72 },
    { id: 'blazers', label: 'Blazers', count: 24 },
    { id: 'pants', label: 'Pants', count: 36 },
    { id: 'skirts', label: 'Skirts', count: 28 },
    { id: 'knitwear', label: 'Knitwear', count: 42 },
    { id: 'outerwear', label: 'Outerwear', count: 18 },
    { id: 'activewear', label: 'Activewear', count: 15 },
  ],
  collections: [
    { id: 'new', label: 'New Arrivals', count: 56 },
    { id: 'spring', label: 'Spring-Summer 2025', count: 124 },
    { id: 'evening', label: 'Evening Collection', count: 32 },
    { id: 'resort', label: 'Resort Collection', count: 48 },
    { id: 'sale', label: 'Sale', count: 89 },
  ],
  colors: [
    { id: 'white', label: 'White', hex: '#FFFFFF' },
    { id: 'black', label: 'Black', hex: '#1A1A1A' },
    { id: 'grey', label: 'Grey', hex: '#808080' },
    { id: 'beige', label: 'Beige', hex: '#F5F5DC' },
    { id: 'brown', label: 'Brown', hex: '#8B4513' },
    { id: 'red', label: 'Red', hex: '#DC143C' },
    { id: 'orange', label: 'Orange', hex: '#FF8C00' },
    { id: 'green', label: 'Green', hex: '#228B22' },
    { id: 'blue', label: 'Blue', hex: '#4169E1' },
    { id: 'navy', label: 'Navy', hex: '#000080' },
    { id: 'pink', label: 'Pink', hex: '#FFB6C1' },
    { id: 'gold', label: 'Gold', hex: '#D4AF37' },
  ],
  sizes: [
    { id: 'xxs', label: 'XXS' },
    { id: 'xs', label: 'XS' },
    { id: 's', label: 'S' },
    { id: 'm', label: 'M' },
    { id: 'l', label: 'L' },
    { id: 'xl', label: 'XL' },
    { id: 'xxl', label: 'XXL' },
    { id: '32', label: '32' },
    { id: '34', label: '34' },
    { id: '36', label: '36' },
    { id: '38', label: '38' },
    { id: '40', label: '40' },
    { id: '42', label: '42' },
    { id: '44', label: '44' },
  ],
};

interface FilterState {
  categories: string[];
  collections: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  onlineOnly: boolean;
}

/**
 * FilterPanel - Advanced filter panel with slide-in animation
 * 
 * Features:
 * - Slide-in from right
 * - Accordion sections: Categories, Collections, Colors, Sizes, Price Range
 * - Toggle for "Available online"
 * - Dual-handle price slider
 * - "Show X products" CTA
 * - Dark luxury theme
 */
export function FilterPanel({ totalProducts = 156 }: { totalProducts?: number }) {
  const { state, dispatch } = useUI();
  const { isRTL, t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories', 'price']);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    collections: [],
    colors: [],
    sizes: [],
    priceRange: [0, 50000],
    onlineOnly: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const toggleFilter = useCallback((type: keyof FilterState, id: string) => {
    setFilters((prev) => {
      const current = prev[type] as string[];
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      return { ...prev, [type]: updated };
    });
  }, []);

  const setOnlineOnly = (value: boolean) => {
    setFilters((prev) => ({ ...prev, onlineOnly: value }));
  };

  const setPriceRange = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      collections: [],
      colors: [],
      sizes: [],
      priceRange: [0, 50000],
      onlineOnly: false,
    });
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_FILTER' });
  };

  // Calculate active filters count
  const activeFiltersCount =
    filters.categories.length +
    filters.collections.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.onlineOnly ? 1 : 0);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const panelVariants = {
    initial: { x: isRTL ? '-100%' : '100%' },
    animate: { x: 0 },
    exit: { x: isRTL ? '-100%' : '100%' },
  };

  return (
    <AnimatePresence>
      {state.isFilterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Filter Panel */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#121212] z-[201] flex flex-col overflow-hidden"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#a87441]/20">
              <div>
                <h2 className="font-serif text-xl text-[#F0EAE6]">
                  {t('filter.title', 'Filters')}
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="text-[11px] text-[#a87441]">
                    {activeFiltersCount} {t('filter.active', 'active')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[11px] uppercase tracking-[0.1em] text-[#AA9B8F] hover:text-[#a87441] transition-colors"
                  >
                    {t('filter.clear', 'Clear All')}
                  </button>
                )}
                <button
                  className="p-2 text-[#F0EAE6] hover:text-[#a87441] transition-colors"
                  onClick={handleClose}
                  aria-label={t('common.close', 'Close')}
                >
                  <Icons.Close />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {/* Online Only Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-[#a87441]/10">
                <span className="text-[#F0EAE6] text-sm">
                  {t('filter.onlineOnly', 'Available online')}
                </span>
                <button
                  onClick={() => setOnlineOnly(!filters.onlineOnly)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    filters.onlineOnly ? 'bg-[#a87441]' : 'bg-[#2A2A2A]'
                  }`}
                  aria-label={t('filter.toggleOnline', 'Toggle online only')}
                >
                  <motion.span
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    initial={false}
                    animate={{
                      left: filters.onlineOnly ? 'calc(100% - 20px)' : '4px',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Categories */}
              <FilterSection
                title={t('filter.categories', 'Categories')}
                isExpanded={expandedSections.includes('categories')}
                onToggle={() => toggleSection('categories')}
              >
                <div className="space-y-2">
                  {filterData.categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center justify-between py-2 cursor-pointer group"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            filters.categories.includes(category.id)
                              ? 'bg-[#a87441] border-[#a87441]'
                              : 'border-[#a87441]/30 group-hover:border-[#a87441]'
                          }`}
                        >
                          {filters.categories.includes(category.id) && (
                            <Icons.Check />
                          )}
                        </span>
                        <span className="text-[#F0EAE6] text-sm">{category.label}</span>
                      </span>
                      <span className="text-[#AA9B8F] text-xs">({category.count})</span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => toggleFilter('categories', category.id)}
                      />
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Collections */}
              <FilterSection
                title={t('filter.collections', 'Collections')}
                isExpanded={expandedSections.includes('collections')}
                onToggle={() => toggleSection('collections')}
              >
                <div className="space-y-2">
                  {filterData.collections.map((collection) => (
                    <label
                      key={collection.id}
                      className="flex items-center justify-between py-2 cursor-pointer group"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            filters.collections.includes(collection.id)
                              ? 'bg-[#a87441] border-[#a87441]'
                              : 'border-[#a87441]/30 group-hover:border-[#a87441]'
                          }`}
                        >
                          {filters.collections.includes(collection.id) && <Icons.Check />}
                        </span>
                        <span className="text-[#F0EAE6] text-sm">{collection.label}</span>
                      </span>
                      <span className="text-[#AA9B8F] text-xs">({collection.count})</span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={filters.collections.includes(collection.id)}
                        onChange={() => toggleFilter('collections', collection.id)}
                      />
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Colors */}
              <FilterSection
                title={t('filter.colors', 'Colors')}
                isExpanded={expandedSections.includes('colors')}
                onToggle={() => toggleSection('colors')}
              >
                <div className="flex flex-wrap gap-2">
                  {filterData.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => toggleFilter('colors', color.id)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        filters.colors.includes(color.id)
                          ? 'border-[#a87441] scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                      aria-label={color.label}
                    >
                      {filters.colors.includes(color.id) && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Icons.Check />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Sizes */}
              <FilterSection
                title={t('filter.sizes', 'Sizes')}
                isExpanded={expandedSections.includes('sizes')}
                onToggle={() => toggleSection('sizes')}
              >
                <div className="flex flex-wrap gap-2">
                  {filterData.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => toggleFilter('sizes', size.id)}
                      className={`min-w-[48px] px-3 py-2 rounded-lg border text-sm transition-all ${
                        filters.sizes.includes(size.id)
                          ? 'bg-[#a87441] border-[#a87441] text-white'
                          : 'bg-transparent border-[#a87441]/30 text-[#F0EAE6] hover:border-[#a87441]'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection
                title={t('filter.price', 'Price Range')}
                isExpanded={expandedSections.includes('price')}
                onToggle={() => toggleSection('price')}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#AA9B8F]">{formatPrice(filters.priceRange[0])}</span>
                    <span className="text-[#AA9B8F]">{formatPrice(filters.priceRange[1])}</span>
                  </div>

                  {/* Price Slider */}
                  <div className="relative h-2 bg-[#2A2A2A] rounded-full">
                    <div
                      className="absolute h-full bg-[#a87441] rounded-full"
                      style={{
                        left: `${(filters.priceRange[0] / 50000) * 100}%`,
                        right: `${100 - (filters.priceRange[1] / 50000) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={100}
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          Math.min(Number(e.target.value), filters.priceRange[1] - 1000),
                          filters.priceRange[1],
                        ])
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={100}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          filters.priceRange[0],
                          Math.max(Number(e.target.value), filters.priceRange[0] + 1000),
                        ])
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>

                  {/* Price Inputs */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase tracking-[0.1em] text-[#AA9B8F] mb-1 block">
                        {t('filter.min', 'Min')}
                      </label>
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Math.max(0, Number(e.target.value)), filters.priceRange[1]])
                        }
                        className="w-full bg-[#1A1A1A] border border-[#a87441]/20 rounded-lg px-3 py-2 text-[#F0EAE6] text-sm focus:border-[#a87441] focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase tracking-[0.1em] text-[#AA9B8F] mb-1 block">
                        {t('filter.max', 'Max')}
                      </label>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([filters.priceRange[0], Math.min(50000, Number(e.target.value))])
                        }
                        className="w-full bg-[#1A1A1A] border border-[#a87441]/20 rounded-lg px-3 py-2 text-[#F0EAE6] text-sm focus:border-[#a87441] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </FilterSection>
            </div>

            {/* Footer */}
            <div className="border-t border-[#a87441]/20 px-6 py-4 space-y-3">
              <button className="w-full bg-[#a87441] hover:bg-[#8B5E3C] text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                {t('filter.showProducts', 'Show {count} products', { count: totalProducts })}
              </button>
              <button
                onClick={handleClose}
                className="w-full bg-transparent border border-[#a87441]/30 text-[#F0EAE6] font-medium py-3 rounded-lg hover:border-[#a87441] transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Filter Section Accordion Component
function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#a87441]/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[#F0EAE6] font-medium">{title}</span>
        <span className={`text-[#AA9B8F] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterPanel;
