import {useState, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useNavigate, useLocation, useSearchParams} from '@remix-run/react';
import type {Filter, ProductFilter} from '@shopify/hydrogen/storefront-api-types';

import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';

// Icons
const Icons = {
  Close: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  Sliders: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  ),
};

// Map common color names to Hex to preserve luxury aesthetic
const COLOR_HEX_MAP: Record<string, string> = {
  black: '#1A1A1A',
  gold: '#D4AF37',
  'mocha tort': '#8B6914',
  'chocolate glaze': '#6B3A2A',
  brown: '#8B4513',
  beige: '#F5F5DC',
  white: '#FFFFFF',
  grey: '#808080',
  navy: '#000080',
  pink: '#FFB6C1',
  red: '#DC143C',
  green: '#228B22',
  silver: '#C0C0C0',
  clear: '#EFEFEF',
  transparent: '#EFEFEF',
};

interface FilterState {
  categories: string[];
  collections: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  onlineOnly: boolean;
}

export function FilterPanel({
  totalProducts = 0,
  filters = [],
}: {
  totalProducts?: number;
  filters?: Filter[];
}) {
  const {state, dispatch} = useUI();
  const {isRTL, t} = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // Initialize expanded sections with the IDs of all filters so they're open by default
  const [expandedSections, setExpandedSections] = useState<string[]>(
    filters.map((f) => f.id)
  );

  // Maintain local state of selected filter JSON string inputs
  const [selectedInputs, setSelectedInputs] = useState<Set<string>>(new Set());
  
  // Initialize price range state if a price filter exists
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const toggleFilter = useCallback((input: string) => {
    setSelectedInputs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(input)) {
        newSet.delete(input);
      } else {
        newSet.add(input);
      }
      return newSet;
    });
  }, []);

  const clearFilters = () => {
    setSelectedInputs(new Set());
    setPriceRange([0, 50000]);
  };

  const handleClose = () => {
    dispatch({type: 'CLOSE_FILTER'});
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(params);

    // Clear existing filter params except non-filter ones (e.g. sort)
    Array.from(newParams.keys()).forEach((key) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        newParams.delete(key);
      }
    });

    // Add selected inputs back
    selectedInputs.forEach((inputString) => {
      try {
        const parsed = JSON.parse(inputString) as Record<string, unknown>;
        Object.entries(parsed).forEach(([key, value]) => {
          newParams.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
        });
      } catch (e) {
        console.error('Failed to parse filter input', e);
      }
    });

    // Add price if modified
    if (priceRange[0] > 0 || priceRange[1] < 50000) {
      newParams.set(`${FILTER_URL_PREFIX}price`, JSON.stringify({min: priceRange[0], max: priceRange[1]}));
    }

    // Reset pagination
    newParams.delete('cursor');
    newParams.delete('direction');

    navigate(`${location.pathname}?${newParams.toString()}`);
    handleClose();
  };

  // Calculate active filters count
  const activeFiltersCount =
    selectedInputs.size + (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const panelVariants = {
    initial: {x: isRTL ? '-100%' : '100%'},
    animate: {x: 0},
    exit: {x: isRTL ? '-100%' : '100%'},
  };

  return (
    <AnimatePresence>
      {state.isFilterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[200]"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={handleClose}
          />

          {/* Filter Panel */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#121212] z-[201] flex flex-col overflow-hidden"
            style={{direction: isRTL ? 'rtl' : 'ltr'}}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
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
              {filters.map((filter) => {
                const isColorFilter =
                  filter.label.toLowerCase() === 'color' || filter.label.toLowerCase() === 'colour';

                return (
                  <FilterSection
                    key={filter.id}
                    title={filter.label}
                    isExpanded={expandedSections.includes(filter.id)}
                    onToggle={() => toggleSection(filter.id)}
                  >
                    {filter.type === 'PRICE_RANGE' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#AA9B8F]">
                            {formatPrice(priceRange[0])}
                          </span>
                          <span className="text-[#AA9B8F]">
                            {formatPrice(priceRange[1])}
                          </span>
                        </div>
      
                        {/* Price Slider */}
                        <div className="relative h-2 bg-[#2A2A2A] rounded-full">
                          <div
                            className="absolute h-full bg-[#a87441] rounded-full"
                            style={{
                              left: `${(priceRange[0] / 50000) * 100}%`,
                              right: `${
                                100 - (priceRange[1] / 50000) * 100
                              }%`,
                            }}
                          />
                          <input
                            type="range"
                            min={0}
                            max={50000}
                            step={100}
                            value={priceRange[0]}
                            onChange={(e) =>
                              setPriceRange([
                                Math.min(
                                  Number(e.target.value),
                                  priceRange[1] - 1000,
                                ),
                                priceRange[1],
                              ])
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{pointerEvents: 'auto'}}
                          />
                          <input
                            type="range"
                            min={0}
                            max={50000}
                            step={100}
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([
                                priceRange[0],
                                Math.max(
                                  Number(e.target.value),
                                  priceRange[0] + 1000,
                                ),
                              ])
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{pointerEvents: 'auto'}}
                          />
                        </div>
                      </div>
                    ) : isColorFilter ? (
                      <div className="flex flex-wrap gap-2">
                        {filter.values.map((option) => {
                          const inputString = option.input as string;
                          const isSelected = selectedInputs.has(inputString);
                          const colorHex = COLOR_HEX_MAP[option.label.toLowerCase()] || '#1A1A1A';

                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleFilter(inputString)}
                              className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-[#a87441] scale-110'
                                  : 'border-transparent hover:scale-105'
                              }`}
                              style={{backgroundColor: colorHex}}
                              title={option.label}
                              aria-label={option.label}
                            >
                              {isSelected && (
                                <span className="absolute inset-0 flex items-center justify-center mix-blend-difference text-white">
                                  <Icons.Check />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filter.values.map((option) => {
                          const inputString = option.input as string;
                          const isSelected = selectedInputs.has(inputString);

                          return (
                            <label
                              key={option.id}
                              className="flex items-center justify-between py-2 cursor-pointer group"
                            >
                              <span className="flex items-center gap-3">
                                <span
                                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? 'bg-[#a87441] border-[#a87441]'
                                      : 'border-[#a87441]/30 group-hover:border-[#a87441]'
                                  }`}
                                >
                                  {isSelected && <Icons.Check />}
                                </span>
                                <span className="text-[#F0EAE6] text-sm">
                                  {option.label}
                                </span>
                              </span>
                              <span className="text-[#AA9B8F] text-xs">
                                ({option.count})
                              </span>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isSelected}
                                onChange={() => toggleFilter(inputString)}
                              />
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </FilterSection>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-[#a87441]/20 px-6 py-4 space-y-3">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-[#a87441] hover:bg-[#8B5E3C] text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {t('filter.showProducts', `Show ${totalProducts} products`)}
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
        <span
          className={`text-[#AA9B8F] transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.2}}
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
