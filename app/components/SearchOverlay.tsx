import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useFetcher } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { useDebounce } from 'react-use';
import { useUI } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

// Icons
const Icons = {
  Search: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7" />
      <line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

// Rotating search placeholders
const searchPlaceholders = [
  'Search for dresses...',
  'Search for bags...',
  'Search for shoes...',
  'Search for jewelry...',
  'Search for beauty...',
];

// Trending searches
const trendingSearches = [
  'Evening Dresses',
  'Designer Bags',
  'Gold Jewelry',
  'New Arrivals',
  'Perfumes',
  'SALE',
  'Accessories',
  'Gift Sets',
];

// Product type for recommendations
interface SearchProduct {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  image: { url: string; altText: string };
  handle: string;
}

export const NO_PREDICTIVE_SEARCH_RESULTS = {
  results: null,
  totalResults: 0,
};

/**
 * SearchOverlay - Full-screen search overlay
 * 
 * Features:
 * - Full-screen overlay (not drawer)
 * - Large search input with rotating placeholders
 * - Trending searches as chips
 * - Product recommendations grid
 * - Real-time predictive search results
 * - Dark luxury theme
 */
export function SearchOverlay() {
  const { state, dispatch } = useUI();
  const { isRTL, t } = useTranslation();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetcher for predictive search
  const fetcher = useFetcher<{ searchResults: { results: any; totalResults: number } }>({
    key: 'search-overlay',
  });

  // Focus input when opened
  useEffect(() => {
    if (state.isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state.isSearchOpen]);

  // Rotate placeholders
  useEffect(() => {
    if (query) return; // Stop rotating when user types
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [query]);

  // Predictive search
  const search = () => {
    if (!query || query.length < 2) return;
    fetcher.load(`/api/predictive-search?q=${encodeURIComponent(query)}&limit=6`);
  };

  useDebounce(search, 300, [query]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SEARCH' });
    setQuery('');
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const { results, totalResults } = fetcher.data?.searchResults || NO_PREDICTIVE_SEARCH_RESULTS;
  const hasResults = query && results && totalResults > 0;

  // Mock recommendations when no search query
  const recommendations: SearchProduct[] = [
    {
      id: '1',
      title: 'Silk Evening Dress',
      price: { amount: '2500.00', currencyCode: 'SAR' },
      image: { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', altText: 'Silk Evening Dress' },
      handle: 'silk-evening-dress',
    },
    {
      id: '2',
      title: 'Leather Crossbody Bag',
      price: { amount: '1800.00', currencyCode: 'SAR' },
      image: { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', altText: 'Leather Crossbody Bag' },
      handle: 'leather-crossbody-bag',
    },
    {
      id: '3',
      title: 'Gold Hoop Earrings',
      price: { amount: '850.00', currencyCode: 'SAR' },
      image: { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', altText: 'Gold Hoop Earrings' },
      handle: 'gold-hoop-earrings',
    },
    {
      id: '4',
      title: 'Designer Sunglasses',
      price: { amount: '1200.00', currencyCode: 'SAR' },
      image: { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80', altText: 'Designer Sunglasses' },
      handle: 'designer-sunglasses',
    },
  ];

  return (
    <AnimatePresence>
      {state.isSearchOpen && (
        <motion.div
          className="fixed inset-0 bg-[#121212] z-[300] flex flex-col"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with Search Input */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-[#a87441]/20">
            <div className="flex-1 relative">
              <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-full px-5 py-3.5 border border-[#a87441]/20 focus-within:border-[#a87441]/50 transition-colors">
                <span className="text-[#AA9B8F]">
                  <Icons.Search />
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-transparent border-none text-[#F0EAE6] text-lg placeholder-[#AA9B8F] outline-none font-sans"
                  placeholder={searchPlaceholders[placeholderIndex]}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    className="text-[#AA9B8F] hover:text-[#F0EAE6] transition-colors"
                    onClick={() => setQuery('')}
                    aria-label={t('common.clear', 'Clear')}
                  >
                    <Icons.Close />
                  </button>
                )}
              </div>
            </div>
            <button
              className="text-[#F0EAE6] hover:text-[#a87441] transition-colors font-sans text-sm uppercase tracking-wider"
              onClick={handleClose}
            >
              {t('common.cancel', 'Cancel')}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
              {/* Search Results */}
              {hasResults ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F]">
                      {t('search.results', 'Results')} ({totalResults})
                    </h3>
                    <Link
                      to={`/search?q=${encodeURIComponent(query)}`}
                      className="text-[#a87441] text-sm hover:text-[#D4AF87] transition-colors flex items-center gap-1"
                      onClick={handleClose}
                    >
                      {t('search.viewAll', 'View All')}
                      <Icons.ArrowRight />
                    </Link>
                  </div>

                  {/* Products Grid */}
                  {results?.products?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {results.products.map((product: any, index: number) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={`/products/${product.handle}`}
                            className="group block"
                            onClick={handleClose}
                          >
                            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#1A1A1A] mb-3">
                              {product.image?.url ? (
                                <Image
                                  data={product.image}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#2A2A2A]" />
                              )}
                            </div>
                            <h4 className="text-[#F0EAE6] text-sm font-medium truncate group-hover:text-[#a87441] transition-colors">
                              {product.title}
                            </h4>
                            {product.price && (
                              <p className="text-[#AA9B8F] text-sm mt-1">
                                <Money data={product.price} />
                              </p>
                            )}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Collections */}
                  {results?.collections?.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F] mb-4">
                        {t('search.collections', 'Collections')}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {results.collections.map((collection: any) => (
                          <Link
                            key={collection.id}
                            to={`/collections/${collection.handle}`}
                            className="px-4 py-2 bg-[#1A1A1A] rounded-full text-[#F0EAE6] text-sm hover:bg-[#a87441]/20 hover:text-[#a87441] transition-colors"
                            onClick={handleClose}
                          >
                            {collection.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Queries */}
                  {results?.queries?.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F] mb-4">
                        {t('search.suggestions', 'Suggestions')}
                      </h4>
                      <div className="space-y-2">
                        {results.queries.map((query: any) => (
                          <button
                            key={query.text}
                            className="block w-full text-left px-4 py-3 text-[#F0EAE6] hover:bg-[#1A1A1A] rounded-lg transition-colors"
                            onClick={() => handleTrendingClick(query.text)}
                          >
                            <span className="flex items-center gap-2">
                              <Icons.Search />
                              {query.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : query && fetcher.state === 'idle' ? (
                /* No Results */
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-[#AA9B8F] text-lg mb-2">
                    {t('search.noResults', 'No results found')}
                  </p>
                  <p className="text-[#AA9B8F]/60 text-sm">
                    {t('search.tryDifferent', 'Try a different search term')}
                  </p>
                </motion.div>
              ) : (
                /* Default Content - Trending & Recommendations */
                <>
                  {/* Trending Searches */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                  >
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F] mb-4">
                      {t('search.trending', 'Trending Searches')}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          className="px-5 py-2.5 bg-transparent border border-[#a87441]/30 rounded-full text-[#F0EAE6] text-sm hover:bg-[#a87441] hover:border-[#a87441] transition-all duration-300"
                          onClick={() => handleTrendingClick(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </motion.section>

                  {/* Product Recommendations */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F]">
                        {t('search.recommendations', 'You May Also Like')}
                      </h3>
                      <Link
                        to="/collections/all"
                        className="text-[#a87441] text-sm hover:text-[#D4AF87] transition-colors flex items-center gap-1"
                        onClick={handleClose}
                      >
                        {t('common.seeAll', 'See All')}
                        <Icons.ArrowRight />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {recommendations.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <Link
                            to={`/products/${product.handle}`}
                            className="group block"
                            onClick={handleClose}
                          >
                            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#1A1A1A] mb-3">
                              <img
                                src={product.image.url}
                                alt={product.image.altText}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="text-[#F0EAE6] text-sm font-medium truncate group-hover:text-[#a87441] transition-colors">
                              {product.title}
                            </h4>
                            <p className="text-[#AA9B8F] text-sm mt-1">
                              <Money
                                data={{
                                  amount: product.price.amount,
                                  currencyCode: product.price.currencyCode,
                                }}
                              />
                            </p>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                </>
              )}

              {/* Loading State */}
              {fetcher.state === 'loading' && (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-[#a87441] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
