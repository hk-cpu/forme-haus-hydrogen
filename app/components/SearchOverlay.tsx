import {useState, useEffect, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link as RemixLink, useFetcher, useRouteLoaderData} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useDebounce} from 'react-use';
import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';
import type {RootLoader} from '~/root';

const Icons = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7" />
      <line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

const searchPlaceholders = [
  'Search products...',
  'Phone cases...',
  'Sunglasses...',
  'New arrivals...',
];

const trendingSearches = [
  'Phone Cases',
  'Sunglasses',
  'Phone Straps',
  'New Arrivals',
  'Bundles',
];

export const NO_PREDICTIVE_SEARCH_RESULTS = {
  results: null,
  totalResults: 0,
};

/**
 * SearchOverlay — Minimalist dropdown search panel
 *
 * Slides down from the top of the page, overlaying the header.
 * Cancel button, Escape key (via UIContext), and backdrop click all dismiss.
 * Results drop in a scrollable panel beneath the search input bar.
 *
 * Fixes applied vs initial version:
 * - product.featuredImage (not product.image)
 * - product.priceRange.minVariantPrice (not product.price)
 * - Locale-aware API URL using pathPrefix from root loader
 * - Duplicate Escape handler removed (UIContext handles it globally)
 * - Loading spinner only shown when no results currently visible
 * - h-20 to match pre-scroll header height
 */
export function SearchOverlay() {
  const {state, dispatch} = useUI();
  const {isRTL, t} = useTranslation();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get locale prefix for locale-aware API URL (e.g. '/ar')
  const rootData = useRouteLoaderData<RootLoader>('root');
  const pathPrefix = rootData?.selectedLocale?.pathPrefix ?? '';

  const fetcher = useFetcher<{
    searchResults: {results: any; totalResults: number};
  }>({key: 'search-overlay'});

  // Reset query when overlay closes (handles Escape via UIContext too)
  useEffect(() => {
    if (!state.isSearchOpen) {
      setQuery('');
    }
  }, [state.isSearchOpen]);

  // Focus input on open
  useEffect(() => {
    if (state.isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [state.isSearchOpen]);

  // Rotate placeholders
  useEffect(() => {
    if (query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [query]);

  // Predictive search — locale-aware URL
  const search = () => {
    if (!query || query.length < 2) return;
    fetcher.load(`${pathPrefix}/api/predictive-search?q=${encodeURIComponent(query)}&limit=6`);
  };

  useDebounce(search, 300, [query]);

  const handleClose = () => {
    dispatch({type: 'CLOSE_SEARCH'});
    // query reset is handled by the isSearchOpen useEffect above
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const {results, totalResults} =
    fetcher.data?.searchResults || NO_PREDICTIVE_SEARCH_RESULTS;
  const hasResults = Boolean(query && results && totalResults > 0);

  return (
    <AnimatePresence>
      {state.isSearchOpen && (
        <>
          {/* Backdrop — click to dismiss */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[299]"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            onClick={handleClose}
          />

          {/* Search Panel — slides down from top */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[300]"
            style={{direction: isRTL ? 'rtl' : 'ltr'}}
            initial={{y: '-100%', opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: '-100%', opacity: 0}}
            transition={{duration: 0.35, ease: [0.25, 0.1, 0.25, 1]}}
          >
            {/* Search Header Bar — h-20 matches pre-scroll header height */}
            <div className="bg-[#121212]/[0.98] backdrop-blur-2xl border-b border-[#a87441]/15">
              <div className="container mx-auto px-6 lg:px-16">
                <div className="flex items-center gap-4 h-20">
                  <span className="text-[#AA9B8F] flex-shrink-0">
                    <Icons.Search />
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent border-none text-[#F0EAE6] text-sm placeholder-[#AA9B8F]/60 outline-none font-sans tracking-wide"
                    placeholder={searchPlaceholders[placeholderIndex]}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button
                      className="text-[#AA9B8F] hover:text-[#F0EAE6] transition-colors p-1 flex-shrink-0"
                      onClick={() => setQuery('')}
                      aria-label={t('common.clear', 'Clear')}
                    >
                      <Icons.Close />
                    </button>
                  )}
                  <motion.button
                    className="text-[#AA9B8F] hover:text-[#a87441] transition-colors text-[11px] uppercase tracking-[0.2em] font-light flex-shrink-0"
                    onClick={handleClose}
                    initial={{opacity: 0, x: 10}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.15}}
                  >
                    {t('common.cancel', 'Cancel')}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Results Dropdown */}
            <div className="bg-[#151515]/[0.98] backdrop-blur-2xl max-h-[65vh] overflow-y-auto">
              <div className="container mx-auto px-6 lg:px-16 py-5">

                {/* Search Results */}
                {hasResults ? (
                  <motion.div
                    initial={{opacity: 0, y: 8}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.05}}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#AA9B8F]">
                        {t('search.results', 'Results')} ({totalResults})
                      </span>
                      <RemixLink
                        to={`${pathPrefix}/search?q=${encodeURIComponent(query)}`}
                        className="text-[#a87441] text-[11px] uppercase tracking-[0.15em] hover:text-[#D4AF87] transition-colors flex items-center gap-1"
                        onClick={handleClose}
                      >
                        {t('search.viewAll', 'View All')}
                        <Icons.ArrowRight />
                      </RemixLink>
                    </div>

                    {/* Products — compact grid */}
                    {results?.products?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {results.products.map((product: any, index: number) => (
                          <motion.div
                            key={product.id}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: index * 0.03}}
                          >
                            <RemixLink
                              to={`${pathPrefix}/products/${product.handle}`}
                              className="group block"
                              onClick={handleClose}
                            >
                              <div className="aspect-square overflow-hidden rounded-lg bg-[#1A1A1A] mb-2">
                                {product.featuredImage?.url ? (
                                  <Image
                                    data={product.featuredImage}
                                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-400"
                                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[#2A2A2A]" />
                                )}
                              </div>
                              <h4 className="text-[#F0EAE6] text-xs font-medium truncate group-hover:text-[#a87441] transition-colors">
                                {product.title}
                              </h4>
                              {product.priceRange?.minVariantPrice && (
                                <p className="text-[#AA9B8F] text-xs mt-0.5">
                                  <Money data={product.priceRange.minVariantPrice} />
                                </p>
                              )}
                            </RemixLink>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Collections chips */}
                    {results?.collections?.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#AA9B8F] mb-3 block">
                          {t('search.collections', 'Collections')}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {results.collections.map((collection: any) => (
                            <RemixLink
                              key={collection.id}
                              to={`${pathPrefix}/collections/${collection.handle}`}
                              className="px-3.5 py-1.5 border border-[#a87441]/20 rounded-full text-[#F0EAE6] text-xs hover:bg-[#a87441]/10 hover:border-[#a87441]/40 transition-all duration-200"
                              onClick={handleClose}
                            >
                              {collection.title}
                            </RemixLink>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Query suggestions */}
                    {results?.queries?.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {results.queries.map((q: any) => (
                            <button
                              key={q.text}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-[#AA9B8F] text-xs hover:text-[#F0EAE6] transition-colors"
                              onClick={() => handleTrendingClick(q.text)}
                            >
                              <Icons.Search />
                              {q.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : query && fetcher.state === 'idle' ? (
                  /* No Results */
                  <motion.div
                    className="text-center py-8"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                  >
                    <p className="text-[#AA9B8F] text-sm">
                      {t('search.noResults', 'No results found')}
                    </p>
                    <p className="text-[#AA9B8F]/50 text-xs mt-1">
                      {t('search.tryDifferent', 'Try a different search term')}
                    </p>
                  </motion.div>
                ) : (
                  /* Default — Trending Searches */
                  <motion.div
                    initial={{opacity: 0, y: 8}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#AA9B8F] mb-3 block">
                      {t('search.trending', 'Trending')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          className="px-4 py-2 border border-[#a87441]/20 rounded-full text-[#F0EAE6]/80 text-xs tracking-wide hover:bg-[#a87441]/10 hover:border-[#a87441]/40 hover:text-[#a87441] transition-all duration-200"
                          onClick={() => handleTrendingClick(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Loading — only when no results currently visible */}
                {fetcher.state === 'loading' && !hasResults && (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-5 h-5 border border-[#a87441] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
