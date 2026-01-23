import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';

export default function EditorialSection() {
    return (
        <section className="py-16 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="font-serif text-3xl italic text-[#4A3C31]">The Edit</h2>
                    <Link to="/journal" className="text-xs uppercase tracking-widest text-[#8B8076] hover:text-[#D48B60] transition-colors">
                        View All Stories
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Large Feature */}
                    <div className="lg:col-span-2 relative aspect-[16/9] md:aspect-auto md:h-[600px] overflow-hidden rounded-sm group cursor-pointer">
                        <img
                            src="/brand/journal-hero.png"
                            alt="Main Editorial"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                            <span className="text-white/80 text-[10px] uppercase tracking-[0.2em] mb-2">Trend Report</span>
                            <h3 className="font-serif text-3xl md:text-4xl text-white italic mb-4">Ramadan Essentials</h3>
                            <span className="text-white text-xs uppercase tracking-widest border-b border-white pb-1 w-fit">Read More</span>
                        </div>
                    </div>

                    {/* Side Column */}
                    <div className="flex flex-col gap-4 md:gap-8 h-full">
                        <div className="relative flex-1 bg-[#E3D8D1] overflow-hidden rounded-sm group cursor-pointer min-h-[280px]">
                            <img
                                src="/brand/atelier-mood.png"
                                alt="Sub Feature 1"
                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                <h4 className="font-serif text-2xl text-white italic drop-shadow-md">Evening Wear</h4>
                            </div>
                        </div>
                        <div className="relative flex-1 bg-[#D48B60] overflow-hidden rounded-sm group cursor-pointer min-h-[280px]">
                            <img
                                src="/brand/silk-texture.png"
                                alt="Sub Feature 2"
                                className="w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                                <h4 className="font-serif text-2xl text-white italic mb-2">New Season</h4>
                                <span className="text-white/80 text-[10px] uppercase tracking-widest">Discover</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
