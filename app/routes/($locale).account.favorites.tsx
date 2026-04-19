import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useFetcher} from '@remix-run/react';
import {useEffect, useState, useCallback} from 'react';
import {Money} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

import {Link} from '~/components/Link';
import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';

export async function loader({context}: LoaderFunctionArgs) {
  // The favorites is client-side (localStorage), so we return minimal data.
  // Products are fetched client-side via the /api/products endpoint.
  return json({});
}

export default function FavoritesPage() {
  const {state, toggleFavorite} = useUI();
  const {t, isRTL} = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products for saved IDs
  const fetchProducts = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      // Use the API route to fetch products by IDs
      const query = ids
        .map((id) => {
          // Extract numeric ID from gid://shopify/Product/XXXXX
          const numericId = id.replace('gid://shopify/Product/', '');
          return `id:${numericId}`;
        })
        .join(' OR ');

      const res = await fetch(
        `/api/products?query=${encodeURIComponent(query)}&count=${ids.length}`,
      );
      const data = await res.json();

      if (data?.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch favorites products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(state.favorites);
  }, [state.favorites, fetchProducts]);

  const handleRemove = (productId: string) => {
    toggleFavorite(productId);
  };

  return (
    <div
      className="min-h-screen bg-cream"
      style={{direction: isRTL ? 'rtl' : 'ltr'}}
    >
      {/* Header */}
      <section className="relative py-12 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-bronze mb-4 block">
              {t('favorites.subtitle', 'Your Curated Selection')}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl italic text-brand-text mb-4">
              {t('favorites.title', 'Favorites')}
            </h1>
            <p className="text-[13px] text-[#8B8076] tracking-wide">
              {state.favorites.length === 0
                ? t(
                    'favorites.emptyHint',
                    'Tap the heart icon on any product to save it here.',
                  )
                : `${state.favorites.length} ${
                    state.favorites.length === 1
                      ? t('favorites.item', 'item')
                      : t('favorites.items', 'items')
                  } ${t('favorites.saved', 'saved')}`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        {loading ? (
          /* Loading skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-surface mb-3" />
                <div className="h-3 w-3/4 rounded bg-surface mb-2" />
                <div className="h-3 w-1/2 rounded bg-surface" />
              </div>
            ))}
          </div>
        ) : state.favorites.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.2}}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-bronze/10 flex items-center justify-center mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-bronze"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-brand-text mb-3">
              {t('favorites.emptyTitle', 'No Favorites Yet')}
            </h2>
            <p className="text-[13px] text-[#8B8076] max-w-sm mb-8 leading-relaxed">
              {t(
                'favorites.emptyDesc',
                'Discover our curated collection and save the pieces that speak to you.',
              )}
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 bg-bronze text-white px-8 py-3.5 rounded-lg text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-bronze-dark transition-colors duration-300"
            >
              {t('favorites.browseBtn', 'Browse Collection')}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.8, transition: {duration: 0.3}}}
                  transition={{delay: index * 0.05, duration: 0.4}}
                  className="group relative"
                >
                  <Link to={`/products/${product.handle}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#F9F9F9] to-warm mb-3 border border-[#EAE4DC] group-hover:shadow-lg transition-shadow duration-500">
                      {product.images?.nodes?.[0]?.url ? (
                        <img
                          src={product.images.nodes[0].url}
                          alt={product.images.nodes[0].altText || product.title}
                          className="w-full h-full object-contain object-center p-3 group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#AA9B8F]/40 text-xs">
                          {product.title}
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(product.id);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-bronze text-white flex items-center justify-center shadow-md hover:bg-bronze-dark transition-colors z-10"
                        aria-label={t('favorites.remove', 'Remove from favorites')}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.15em] text-bronze font-medium">
                        {product.vendor || 'Formé Haus'}
                      </p>
                      <h3 className="font-serif text-sm text-warm leading-snug group-hover:text-bronze transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      {product.priceRange?.minVariantPrice && (
                        <p className="text-sm text-warm font-medium">
                          <Money
                            data={product.priceRange.minVariantPrice}
                            withoutTrailingZeros
                          />
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
