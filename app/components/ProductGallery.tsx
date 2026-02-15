import { Image } from '@shopify/hydrogen';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

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
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!media.length) {
    return null;
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveImage(index);
    }
  };

  return (
    <div className={`product-gallery-container ${className}`}>
      {/* Mobile Carousel / Desktop Grid */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 md:gap-px md:overflow-visible md:snap-none aspect-[3/4] md:aspect-auto"
      >
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
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Scroll Indicators */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {media.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImage ? 'w-6 bg-[#4A3C31]' : 'w-1.5 bg-[#4A3C31]/20'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
