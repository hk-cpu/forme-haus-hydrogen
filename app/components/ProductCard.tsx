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
      className="group relative flex flex-col gap-3"
      prefetch="viewport"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-white/5 relative border border-white/5">
        {image && (
          <Image
            data={image}
            aspectRatio="3/4"
            sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
            loading={loading}
          />
        )}

        {/* Quick Add Overlay / View Product */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
          <button className="w-full bg-white/90 backdrop-blur text-black py-3 text-[10px] uppercase tracking-widest font-medium hover:bg-white transition-colors">
            View Product
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start text-sm text-[#F0EAE6]">
        <div>
          <h3 className="font-serif text-base tracking-wide group-hover:underline decoration-1 underline-offset-4">
            {product.title}
          </h3>
          <p className="text-[#F0EAE6]/60 text-xs mt-1 uppercase tracking-widest">
            {/* Fallback to generic text or collection name if available in fragment */}
            Formé Haus
          </p>
        </div>
        <Money data={price!} className="font-medium tracking-wide" />
      </div>
    </Link>
  );
}
