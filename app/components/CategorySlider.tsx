import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';

const CATEGORIES = [
    { id: 1, title: 'New In', image: '/brand/silk-texture.png', url: '/collections/new-in' },
    { id: 2, title: 'Dresses', image: '/brand/placeholder-drape.png', url: '/collections/dresses' },
    { id: 3, title: 'Abayas', image: '/brand/atelier-mood.png', url: '/collections/abayas' },
    { id: 4, title: 'Kaftans', image: '/brand/journal-motion.png', url: '/collections/kaftans' },
    { id: 5, title: 'Shoes', image: '/brand/journal-hero.png', url: '/collections/shoes' },
    { id: 6, title: 'Bags', image: '/brand/journal-identity.png', url: '/collections/bags' },
    { id: 7, title: 'Accessories', image: '/brand/silk-texture.png', url: '/collections/accessories' },
    { id: 8, title: 'Sunglasses', image: '/brand/journal-motion.png', url: '/collections/sunglasses' },
    { id: 9, title: 'Sale', image: '/brand/placeholder-drape.png', url: '/collections/sale' },
];

export default function CategorySlider() {
    return (
        <section className="py-12 border-b border-[#8B8076]/10">
            <div className="container mx-auto px-6">
                <h2 className="font-serif text-2xl italic text-[#4A3C31] mb-6">Shop by Category</h2>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
                    {CATEGORIES.map((cat, i) => (
                        <Link
                            key={cat.id}
                            to={cat.url}
                            className="flex-shrink-0 w-32 md:w-40 snap-start group"
                        >
                            <div className="aspect-[4/5] rounded-full overflow-hidden mb-4 border border-[#F0EAE6] relative">
                                {/* Fallback Image / Placeholder */}
                                <div className="absolute inset-0 bg-[#F0EAE6] animate-pulse" />
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-10"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-center text-xs uppercase tracking-widest text-[#5C5046] group-hover:text-[#D48B60] transition-colors">
                                {cat.title}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Hide Scrollbar styling */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
        </section>
    );
}
