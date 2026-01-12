import { Link } from '@remix-run/react';
import { Image, Money, flattenConnection } from '@shopify/hydrogen';
import type { Product } from '@shopify/hydrogen/storefront-api-types';
import type { ProductCardFragment } from 'storefrontapi.generated';
import { getProductPlaceholder } from '~/lib/placeholders';

export function ProductCard({
  product,
  loading,
}: {
  product: ProductCardFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];
  if (!firstVariant) return null;

  const { image, price } = firstVariant;

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group relative flex flex-col gap-3 cursor-pointer"
      prefetch="viewport"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-white/5 relative border border-white/5">
        {/* Stealth Mode: Image Replacement */}
        <div className="w-full h-full bg-transparent flex items-center justify-center">
          <div className="text-[#F0EAE6]/5 border border-[#F0EAE6]/10 w-full h-full" />
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-20">
          <button className="w-full bg-[#121212]/80 backdrop-blur-md text-[#F0EAE6] border border-[#F0EAE6]/20 py-3 text-[10px] uppercase tracking-widest font-medium hover:bg-[#F0EAE6] hover:text-[#121212] transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start text-sm text-[#F0EAE6]">
        <div className="space-y-1">
          <h3 className="font-serif text-lg tracking-wide group-hover:text-white transition-colors">
            COMING SOON
          </h3>
          <p className="text-[#F0EAE6]/50 text-[10px] uppercase tracking-[0.2em]">
            Formé Haus
          </p>
        </div>
        {/* Stealth Mode: Hide Price */}
        {/* <Money data={price!} className="font-sans font-medium tracking-wide text-[#F0EAE6]/90" /> */}
      </div>
    </Link >
  );
}
