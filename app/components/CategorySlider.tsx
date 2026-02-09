import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

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

// Individual Category Card Component
function CategoryCard({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={cat.url} className="flex-shrink-0 w-36 md:w-48 snap-start block group">
                {/* Glass Card Container */}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative
                    bg-gradient-to-br from-white/10 to-white/5 
                    backdrop-blur-xl 
                    border border-white/20
                    hover:border-[#a87441]/50
                    transition-all duration-500 
                    shadow-lg shadow-black/30
                    hover:shadow-xl hover:shadow-[#a87441]/20">
                    
                    {/* Side Glow Effects - CSS-based */}
                    <div 
                        className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-[#a87441]/60 to-transparent z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <div 
                        className={`absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-[#a87441]/60 to-transparent z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <div 
                        className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#a87441]/40 to-transparent z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <div 
                        className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-[#a87441]/40 to-transparent z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Main Border Glow on Hover */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 z-10 pointer-events-none
                        ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            background: 'linear-gradient(135deg, rgba(168,116,65,0.3) 0%, transparent 50%, rgba(168,116,65,0.3) 100%)',
                        }}
                    />

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
                    
                    {/* Image with CSS Zoom Animation */}
                    <div 
                        className={`w-full h-full transition-transform duration-[4000ms] ease-in-out ${isHovered ? 'scale-[1.15]' : 'scale-100'}`}
                    >
                        <img
                            src={cat.image}
                            alt={cat.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Shimmer Sweep Effect */}
                    <div className={`absolute inset-0 z-15 pointer-events-none overflow-hidden rounded-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>

                    {/* Corner Accents */}
                    <div className={`absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-[#a87441]/0 
                        transition-all duration-300 z-20
                        ${isHovered ? 'border-[#a87441]/80 w-10 h-10' : ''}`} />
                    <div className={`absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-[#a87441]/0 
                        transition-all duration-300 z-20
                        ${isHovered ? 'border-[#a87441]/80 w-10 h-10' : ''}`} />

                    {/* Category Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                        <span 
                            className={`text-[10px] uppercase tracking-[0.25em] text-[#a87441] block mb-1.5 transition-all duration-300 ${isHovered ? '-translate-y-0.5' : ''}`}
                        >
                            Explore
                        </span>
                        <h4 
                            className={`font-serif text-xl text-[#F0EAE6] transition-all duration-300 ${isHovered ? 'translate-x-0.5' : ''}`}
                        >
                            {cat.title}
                        </h4>
                    </div>

                    {/* Hover indicator dot */}
                    <div 
                        className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-[#a87441] z-20 transition-all duration-300 ${isHovered ? 'scale-100 opacity-100 animate-pulse' : 'scale-0 opacity-0'}`}
                    />
                </div>
            </Link>
        </motion.div>
    );
}

export default function CategorySlider() {
    return (
        <section className="py-16 relative">
            {/* Glass Background Container */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/50 via-[#1a1a1a]/30 to-[#121212]/50 backdrop-blur-sm" />
            
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#a87441] mb-3 block">
                        Curated Selection
                    </span>
                    <h2 className="font-serif text-3xl italic text-[#F0EAE6]">
                        The Collections
                    </h2>
                    <div className="w-16 h-[1px] bg-[#a87441]/50 mx-auto mt-4" />
                </motion.div>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide px-2">
                    {CATEGORIES.map((cat, i) => (
                        <CategoryCard key={cat.id} cat={cat} index={i} />
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
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
            `}</style>
        </section>
    );
}
