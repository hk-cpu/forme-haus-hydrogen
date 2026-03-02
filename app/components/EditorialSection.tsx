import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';
import {BlurRevealImage} from '~/components/BlurRevealImage';

export default function EditorialSection() {
  return (
    <section>
      <div className="max-w-[1200px] mx-auto" style={{padding: '0 var(--page-gutter)'}}>
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="flex justify-between items-end mb-8"
        >
          <h2 className="font-serif text-3xl italic text-[#4A3C31]">
            The Edit
          </h2>
          <Link
            to="/journal"
            className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076] hover:text-[#a87441] transition-colors duration-300"
          >
            View All Stories
          </Link>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1]}}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Large Feature — blur-reveal on hover */}
          <Link
            to="/collections/new-in"
            className="lg:col-span-2 relative aspect-[16/9] lg:aspect-auto lg:min-h-[540px] overflow-hidden rounded-lg group cursor-pointer block"
          >
            <BlurRevealImage
              src="/brand/edit-modern-essentials.webp"
              blurSrc="/brand/edit-modern-essentials-blur.png"
              alt="Modern Essentials"
              className="absolute inset-0 w-full h-full"
              breatheDuration={7}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-10 pointer-events-none z-10">
              <span className="text-white/70 text-[10px] uppercase tracking-[0.2em] mb-2">
                Explore
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white italic mb-3">
                Modern Essentials
              </h3>
              <span className="text-white/70 text-[11px] uppercase tracking-[0.15em] group-hover:text-[#D4AF87] transition-colors duration-300">
                Discover
                <span className="block h-px w-0 group-hover:w-16 bg-[#D4AF87] transition-all duration-500 mt-1.5" />
              </span>
            </div>
          </Link>

          {/* Side Column — 3 editorial cards with blur-reveal */}
          <div className="flex flex-col gap-4 h-full">
            {[
              {
                to: '/collections/sunglasses',
                title: 'Sun Ready',
                desc: 'For golden hours and everyday light',
                img: '/brand/edit-sun-ready.webp',
                blurImg: '/brand/edit-sun-ready-blur.webp',
              },
              {
                to: '/collections/phone-cases',
                title: 'Carry It Your Way',
                desc: 'Hands-free. Effortless. Elevated.',
                img: '/brand/edit-carry.webp',
                blurImg: '/brand/edit-carry-blur.png',
              },
              {
                to: '/collections/new-in',
                title: 'New Arrivals',
                desc: 'Latest additions to the Haus.',
                img: '/brand/edit-new-arrivals.webp',
                blurImg: '/brand/edit-new-arrivals-blur.webp',
              },
            ].map((box, i) => (
              <Link
                key={box.to + box.title}
                to={box.to}
                className="relative flex-1 overflow-hidden rounded-lg group cursor-pointer min-h-[150px] block"
              >
                <BlurRevealImage
                  src={box.img}
                  blurSrc={box.blurImg}
                  alt={box.title}
                  className="absolute inset-0 w-full h-full"
                  breatheDuration={5 + i * 0.8}
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-500 flex flex-col items-center justify-center text-center p-4 pointer-events-none z-10">
                  <h4 className="font-serif text-xl md:text-2xl text-white italic drop-shadow-md mb-1">
                    {box.title}
                  </h4>
                  <p className="text-white/65 text-[11px] tracking-wide">
                    {box.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
