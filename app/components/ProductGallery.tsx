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
            className="aspect-[4/5] w-full bg-[#121212] overflow-hidden group"
            key={med.id || image?.id}
          >
            {image && (
              <Image
                loading={i === 0 ? 'eager' : 'lazy'}
                data={image}
                aspectRatio="4/5"
                sizes="(min-width: 48em) 60vw, 90vw"
                className="object-cover w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform group-hover:scale-105"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
