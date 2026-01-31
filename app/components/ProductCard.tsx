import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from '@remix-run/react';
import { Image, Money, flattenConnection } from '@shopify/hydrogen';
import type { Product } from '@shopify/hydrogen/storefront-api-types';
import type { ProductCardFragment } from 'storefrontapi.generated';
import { getProductPlaceholder } from '~/lib/placeholders';
import { useTranslation } from '~/hooks/useTranslation';

export function ProductCard({
  product,
  loading,
}: {
  product: ProductCardFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Motion Values for Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  // Transform motion values to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();

  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];
  if (!firstVariant) return null;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          to={`/products/${product.handle}`}
          className="group relative flex flex-col gap-3 cursor-pointer"
          prefetch="viewport"
        >
          <div className="aspect-[3/4] w-full overflow-hidden bg-white/5 relative border border-white/5">
            {/* 3D Depth Layer */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ transform: "translateZ(20px)" }}
            />

            <div className="w-full h-full bg-transparent flex items-center justify-center">
              <div className="text-[#F0EAE6]/5 border border-[#F0EAE6]/10 w-full h-full" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-20">
              <button className="w-full bg-[#121212]/80 backdrop-blur-md text-[#F0EAE6] border border-[#F0EAE6]/20 py-3 text-[10px] uppercase tracking-widest font-medium hover:bg-[#F0EAE6] hover:text-[#121212] transition-colors duration-300">
                {t('product.viewDetails')}
              </button>
            </div>
          </div>

          <div
            className="flex justify-between items-start text-sm text-[#F0EAE6]"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="space-y-1">
              <h3 className="font-serif text-lg tracking-wide group-hover:text-white transition-colors">
                {t('product.comingSoon')}
              </h3>
              <p className="text-[#F0EAE6]/50 text-[10px] uppercase tracking-[0.2em]">
                Formé Haus
              </p>
            </div>
          </div>
        </Link >
      </motion.div>
    </div>
  );
}
