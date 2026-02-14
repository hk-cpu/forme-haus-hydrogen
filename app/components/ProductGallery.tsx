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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}
    >
      {media.map((med, i) => {
        const image =
          med.__typename === 'MediaImage'
            ? { ...med.image, altText: med.alt || 'Product image' }
            : null;

        const isFullWidth = i % 3 === 0; // Make every 3rd image full width for rhythm

        return (
          <motion.div
            variants={item}
            className={`
              aspect-[3/4] w-full bg-[#F9F5F0] overflow-hidden group relative
              ${isFullWidth ? 'md:col-span-2 md:aspect-[16/9]' : 'md:col-span-1'}
            `}
            key={med.id || (image && 'id' in image ? image.id : i)}
          >
            {image ? (
              <Image
                data={image}
                aspectRatio={isFullWidth ? "16/9" : "3/4"}
                sizes={isFullWidth ? "(min-width: 45em) 100vw, 100vw" : "(min-width: 45em) 50vw, 100vw"}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-[#8B8076]/20">No Image</div>
              </div>
            )}
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
