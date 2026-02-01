import { Image } from '@shopify/hydrogen';

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
    <div
      className={`grid gap-4 md:gap-8 ${className}`}
    >
      {media.map((med, i) => {
        const image =
          med.__typename === 'MediaImage'
            ? { ...med.image, altText: med.alt || 'Product image' }
            : null;

        return (
          <div
            className="aspect-[4/5] w-full bg-[#121212] overflow-hidden group border border-white/5"
            key={med.id || (image && 'id' in image ? image.id : i)}
          >
            {image ? (
              <Image
                data={image}
                aspectRatio="4/5"
                sizes="(min-width: 45em) 50vw, 100vw"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-transparent flex items-center justify-center">
                <div className="text-[#F0EAE6]/5 w-full h-full border border-white/5" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
