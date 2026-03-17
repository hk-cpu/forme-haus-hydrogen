// NOTE: This file is superseded by EditorialSection.tsx which is the active component.
// Kept for reference. Image paths corrected to use /brand/ webp assets.
import {Link} from '@remix-run/react';

export function Editorial() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-medium tracking-wide">The Edit</h2>
        <span className="text-sm text-[#8B8076] tracking-wider uppercase">Editorial</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[750px]">
        {/* Large left - Modern Essentials */}
        <Link
          to="/collections/all"
          className="md:col-span-5 md:row-span-2 relative group overflow-hidden rounded-lg block h-[400px] md:h-auto"
        >
          <img
            src="/brand/edit-modern-essentials.webp"
            alt="Modern Essentials"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <h3 className="text-white text-lg font-medium mb-1">Modern Essentials</h3>
            <p className="text-white/80 text-sm">Timeless pieces for everyday elegance</p>
          </div>
        </Link>

        {/* Top right - Sun Ready */}
        <Link
          to="/collections/sunglasses"
          className="md:col-span-7 md:row-span-1 relative group overflow-hidden rounded-lg block h-[300px] md:h-auto"
        >
          <img
            src="/brand/edit-sun-ready.webp"
            alt="Sun Ready"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <h3 className="text-white text-lg font-medium mb-1">Sun Ready</h3>
            <p className="text-white/80 text-sm">For golden hours</p>
          </div>
        </Link>

        {/* Bottom left - Carry It Your Way */}
        <Link
          to="/collections/phone-cases"
          className="md:col-span-3 md:row-span-1 relative group overflow-hidden rounded-lg block h-[300px] md:h-auto"
        >
          <img
            src="/brand/edit-carry.webp"
            alt="Carry It Your Way"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <h3 className="text-white text-base font-medium">Carry It Your Way</h3>
          </div>
        </Link>

        {/* Bottom right - New Arrivals */}
        <Link
          to="/collections/new-in"
          className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-lg block h-[300px] md:h-auto"
        >
          <img
            src="/brand/edit-new-arrivals.webp"
            alt="New Arrivals"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <h3 className="text-white text-base font-medium mb-1">New Arrivals</h3>
            <p className="text-white/80 text-sm">Latest from the Haus</p>
          </div>
        </Link>
      </div>
    </section>
  );
}