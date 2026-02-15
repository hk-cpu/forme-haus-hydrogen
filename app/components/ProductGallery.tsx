import { Image } from '@shopify/hydrogen';
import { motion } from 'framer-motion';

import type { MediaFragment } from 'storefrontapi.generated';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  if (!media.length) {
    return null;
  }

  return (
    <div className={`product-gallery-container ${className}`}>
      {/* 
        Mobile: Flex container with overflow-x-auto for native swipe
        Desktop: Grid with 2 columns
      */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 md:gap-px md:overflow-visible md:snap-none aspect-[3/4] md:aspect-auto">
        {media.map((med, i) => {
          const image =
            med.__typename === 'MediaImage'
              ? { ...med.image, altText: med.alt || 'Product image' }
              : null;

          return (
            <div
              className={`
                flex-shrink-0 w-full h-full snap-center relative
                md:w-auto md:h-auto md:snap-align-none
                md:col-span-1
              `}
              key={med.id || (image && 'id' in image ? image.id : i)}
            >
              <div className="w-full h-full bg-[#F9F5F0] overflow-hidden relative aspect-[3/4]">
                {image ? (
                  <Image
                    data={image}
                    aspectRatio="3/4"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-[#8B8076]/20">No Image</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
