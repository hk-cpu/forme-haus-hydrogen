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
        <section className="py-12">
            <div className="container mx-auto px-6">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-serif text-2xl italic text-[#F0EAE6] mb-8 text-center"
                >
                    The Collections
                </motion.h2>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                to={cat.url}
                                className="flex-shrink-0 w-32 md:w-40 snap-start group block"
                            >
                                {/* Glass/Transparent Card with Live Zoom */}
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative
                                    bg-white/5 backdrop-blur-md border border-white/10
                                    hover:bg-white/10 hover:border-[#a87441]/30
                                    transition-all duration-500 shadow-lg shadow-black/20 group/card">
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none" />
                                    
                                    {/* Animated Glow on Hover */}
                                    <motion.div 
                                        className="absolute inset-0 bg-[#a87441]/10 z-[5]"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    
                                    {/* Live Zoom Image Container */}
                                    <motion.div 
                                        className="w-full h-full"
                                        whileHover={{ scale: 1.15 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 300, 
                                            damping: 20,
                                            duration: 0.6 
                                        }}
                                    >
                                        <img
                                            src={cat.image}
                                            alt={cat.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </motion.div>
                                    
                                    {/* Shimmer Effect on Hover */}
                                    <div className="absolute inset-0 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
                                    </div>
                                    
                                    {/* Collection Title on Image */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                                        <motion.span 
                                            className="text-[10px] uppercase tracking-[0.2em] text-[#F0EAE6]/70 block mb-1"
                                            initial={{ y: 0 }}
                                            whileHover={{ y: -2 }}
                                        >
                                            Explore
                                        </motion.span>
                                        <motion.h4 
                                            className="font-serif text-lg text-[#F0EAE6] group-hover/card:text-[#a87441] transition-colors duration-300"
                                            whileHover={{ x: 2 }}
                                        >
                                            {cat.title}
                                        </motion.h4>
                                    </div>
                                </div>
                                
                                {/* Title Below */}
                                <h3 className="text-center text-xs uppercase tracking-widest text-[#AA9B8F] group-hover:text-[#a87441] transition-colors">
                                    {cat.title}
                                </h3>
                            </Link>
                        </motion.div>
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
