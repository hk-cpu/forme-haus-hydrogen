import {useFetcher, Link as RemixLink} from '@remix-run/react';
import {useEffect, useRef, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {useDebounce} from 'react-use';

import {Input} from '~/components/Input';

export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = {
  results: null,
  totalResults: 0,
};

export type NormalizedPredictiveSearchResults = {
  results: {
    articles: any[];
    collections: any[];
    pages: any[];
    products: any[];
    queries: any[];
  } | null;
  totalResults: number;
};

export function PredictiveSearch({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const fetcher = useFetcher<{
    searchResults: NormalizedPredictiveSearchResults;
  }>({
    key: 'predictive-search',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const search = () => {
    if (!searchTerm) return;
    fetcher.load(
      `/api/predictive-search?q=${encodeURIComponent(searchTerm)}&limit=5`,
    );
  };

  useDebounce(search, 300, [searchTerm]);

  const {results, totalResults} =
    fetcher.data?.searchResults || NO_PREDICTIVE_SEARCH_RESULTS;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-4 p-6 border-b border-warm/10">
        <form
          className="w-full relative"
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            search();
          }}
        >
          <Input
            ref={inputRef}
            type="search"
            name="q"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search..."
            className="w-full bg-transparent border-none text-warm text-lg placeholder-warm/30 focus:ring-0 px-0 py-2 border-b border-warm/20 rounded-none font-serif"
            variant="search"
          />
          <button className="absolute right-0 top-1/2 -translate-y-1/2 text-warm/50 uppercase text-[10px] tracking-widest hover:text-[#C4A484] transition-colors">
            SEARCH
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {!searchTerm && (
          <div className="text-center text-warm/40 text-sm mt-12 font-serif italic">
            Start typing to discover...
          </div>
        )}

        {fetcher.state === 'loading' && (
          <div className="text-center text-warm/40 text-sm mt-12 animate-pulse">
            Searching...
          </div>
        )}

        {searchTerm && totalResults === 0 && fetcher.state === 'idle' && (
          <div className="text-center text-warm/40 text-sm mt-12">
            No results found for &quot;{searchTerm}&quot;
          </div>
        )}

        {searchTerm && results && (
          <div className="space-y-10">
            {/* Products */}
            {results.products?.length > 0 && (
              <div>
                <h3 className="text-warm/50 text-xs uppercase tracking-[0.2em] mb-4">
                  Products
                </h3>
                <ul className="grid gap-4">
                  {results.products.map((product) => (
                    <li key={product.id} className="group">
                      <RemixLink
                        to={`/products/${product.handle}`}
                        onClick={onClose}
                        className="flex items-center gap-4"
                      >
                        {/* Image */}
                        <div className="w-12 h-16 bg-warm/5 overflow-hidden border border-white/10 flex items-center justify-center">
                          {product.image ? (
                            <Image
                              data={product.image}
                              alt={product.title}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover"
                              sizes="64px"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full border border-white/5" />
                          )}
                        </div>

                        <div>
                          <p className="text-warm text-sm font-medium group-hover:text-[#C4A484] transition-colors duration-300 font-serif">
                            {product.title}
                          </p>
                          {/* Price */}
                          {product.variants?.nodes?.[0]?.price && (
                            <div className="text-warm/60 text-xs mt-1">
                              <Money data={product.variants.nodes[0].price} />
                            </div>
                          )}
                        </div>
                      </RemixLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Collections */}
            {results.collections?.length > 0 && (
              <div>
                <h3 className="text-warm/50 text-xs uppercase tracking-[0.2em] mb-4">
                  Collections
                </h3>
                <ul className="grid gap-2">
                  {results.collections.map((collection) => (
                    <li key={collection.id}>
                      <RemixLink
                        to={`/collections/${collection.handle}`}
                        onClick={onClose}
                        className="text-warm hover:text-[#C4A484] transition-colors text-sm"
                      >
                        {collection.title}
                      </RemixLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Articles */}
            {results.articles?.length > 0 && (
              <div>
                <h3 className="text-warm/50 text-xs uppercase tracking-[0.2em] mb-4">
                  Journal
                </h3>
                <ul className="grid gap-2">
                  {results.articles.map((article) => (
                    <li key={article.id}>
                      <RemixLink
                        to={`/journal/${article.handle}`}
                        onClick={onClose}
                        className="text-warm hover:text-[#C4A484] transition-colors text-sm font-serif"
                      >
                        {article.title}
                      </RemixLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
