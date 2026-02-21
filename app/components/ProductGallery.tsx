import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import type {MediaFragment} from 'storefrontapi.generated';

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
        Desktop: Grid layout with first image large
      */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-2 gap-1 md:gap-2 md:overflow-visible md:snap-none">
        {media.map((med, i) => {
          const image =
            med.__typename === 'MediaImage'
              ? {...med.image, altText: med.alt || 'Product image'}
              : null;

          // Make every 3rd image span full width on desktop for variety, or keep it simple grid
          // For now, let's do a simple clean grid but with improved spacing/aspect ratio
          const isFullWidth = i % 3 === 0 && i !== 0;

          return (
            <div
              className={`
                flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-auto h-auto snap-center relative
                aspect-[3/4]
                md:col-span-1
              `}
              key={med.id || (image && 'id' in image ? image.id : i)}
            >
              <div className="w-full h-full bg-[#F5F2ED] overflow-hidden relative group cursor-zoom-in">
                {image ? (
                  <Image
                    data={image}
                    aspectRatio="3/4"
                    sizes="(min-width: 768px) 50vw, 90vw"
                    className="w-full h-full object-cover transition-transform duration-[0.8s] ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-[#8B8076]/20 font-serif italic">
                      No Image
                    </div>
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
