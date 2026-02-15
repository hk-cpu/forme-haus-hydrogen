import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';

export default function EditorialSection() {
    return (
        <section className="py-16 px-4 md:px-8">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex justify-between items-end mb-8"
                >
                    <h2 className="font-serif text-3xl italic text-[#4A3C31]">The Edit</h2>
                    <Link to="/journal" className="text-xs uppercase tracking-widest text-[#8B8076] hover:text-[#a87441] transition-colors">
                        View All Stories
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                >
                    {/* Large Feature */}
                    <Link to="/collections/new-in" className="lg:col-span-2 relative aspect-[16/9] md:aspect-auto md:h-[600px] overflow-hidden rounded-xl group cursor-pointer block">
                        <img
                            src="/brand/journal-hero.png"
                            alt="Modern Essentials"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                            <span className="text-white/80 text-[10px] uppercase tracking-[0.2em] mb-2">Explore</span>
                            <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-4">Modern Essentials</h3>
                            <span className="text-white/80 text-xs uppercase tracking-widest group-hover:text-[#D4AF87] transition-colors duration-300">
                                Discover
                                <span className="block h-px w-0 group-hover:w-full bg-[#D4AF87] transition-all duration-500 mt-1" />
                            </span>
                        </div>
                    </Link>

                    {/* Side Column - 3 Boxes */}
                    <div className="flex flex-col gap-4 md:gap-5 h-full">
                        {/* Box 1: Sun Ready */}
                        <Link to="/collections/sunglasses" className="relative flex-1 overflow-hidden rounded-xl group cursor-pointer min-h-[200px] block">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6D3] to-[#E3D8D1]" />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500 flex flex-col items-center justify-center text-center p-4">
                                <h4 className="font-serif text-2xl text-white italic drop-shadow-md mb-1">Sun Ready</h4>
                                <p className="text-white/70 text-[11px] tracking-wide">Golden hours and everyday light</p>
                            </div>
                        </Link>

                        {/* Box 2: Carry it your way */}
                        <Link to="/collections/bags" className="relative flex-1 overflow-hidden rounded-xl group cursor-pointer min-h-[200px] block">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E8DDD4] to-[#D4C5B9]" />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500 flex flex-col items-center justify-center text-center p-4">
                                <h4 className="font-serif text-2xl text-white italic drop-shadow-md mb-1">Carry it your way</h4>
                                <p className="text-white/70 text-[11px] tracking-wide">Hands-free. Effortless. Elevated.</p>
                            </div>
                        </Link>

                        {/* Box 3: New Arrivals */}
                        <Link to="/collections/new-in" className="relative flex-1 overflow-hidden rounded-xl group cursor-pointer min-h-[200px] block">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D48B60] to-[#C07A52]" />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                                <h4 className="font-serif text-2xl text-white italic mb-1">New Arrivals</h4>
                                <p className="text-white/70 text-[11px] tracking-wide">Latest additions to the Haus.</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
