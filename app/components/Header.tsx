import { useState, useEffect, Suspense } from 'react';
import { Link, Await, useRouteLoaderData } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useWindowScroll } from 'react-use';
import { motion } from 'framer-motion';
import { useIsHomePath } from '~/lib/utils';
import type { RootLoader } from '~/root';
import LanguageSwitch from './LanguageSwitch';
import type { EnhancedMenu } from '~/lib/utils';

export function Header({
    title,
    menu,
    openCart,
    openSearch,
}: {
    title: string;
    menu?: EnhancedMenu;
    openCart: () => void;
    openSearch: () => void;
}) {
    const isHome = useIsHomePath();
    const { y } = useWindowScroll();
    const [scrolled, setScrolled] = useState(false);
    const rootData = useRouteLoaderData<RootLoader>('root');

    useEffect(() => {
        setScrolled(y > 20);
    }, [y]);

    // Default Nav Links if menu is missing
    const defaultLinks = [
        { id: '1', title: 'SHOP', to: '/collections/all' },
        { id: '2', title: 'COLLECTIONS', to: '/collections' },
        { id: '3', title: 'JOURNAL', to: '/journal' },
        { id: '4', title: 'ABOUT', to: '/pages/about' },
    ];

    const items = menu?.items?.length ? menu.items : defaultLinks;

    return (
        <header
            role="banner"
            className={`sticky top-0 z-50 transition-all duration-700 w-full ease-[cubic-bezier(0.32,0.72,0,1)]
            ${scrolled
                    ? 'bg-[#121212]/30 backdrop-blur-md py-4 border-b border-white/5'
                    : 'bg-transparent py-8'
                }`}
        >
            <div
                className={`absolute inset-0 transition-opacity duration-700 ${scrolled
                    ? 'opacity-20 bg-gradient-to-b from-black/40 to-transparent'
                    : 'opacity-0'
                    }`}
            />

            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between relative z-50">
                {/* Desktop Navigation - LEFT */}
                <nav className="hidden md:flex items-center gap-12">
                    {items.slice(0, 2).map((item: any) => (
                        <div key={item.id} className="h-full flex items-center relative">
                            <Link
                                to={item.to}
                                className="text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-300 relative group font-sans text-[#F0EAE6] hover:text-white"
                            >
                                {item.title}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-500 ease-out group-hover:w-full" />
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Mobile Menu Toggle - Placeholder */}
                <button className="md:hidden text-[#F0EAE6]">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Centered Logo */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto h-20 flex items-center justify-center">
                    <Link to="/" className="block relative h-full">
                        <div
                            className={`relative flex items-center justify-center transition-all duration-700 ${scrolled ? 'h-8' : 'h-12'
                                }`}
                        >
                            <Image
                                data={{
                                    url: '/logo.png',
                                    altText: 'FORMÉ HAUS',
                                    width: 180,
                                    height: 45,
                                }}
                                width={180}
                                height={45}
                                className="w-auto h-full object-contain"
                                loading="eager"
                            />
                        </div>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-10">
                    <nav className="hidden md:flex items-center gap-12 mr-6">
                        {items.slice(2).map((item: any) => (
                            <div key={item.id} className="h-full flex items-center relative">
                                <Link
                                    to={item.to}
                                    className="text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-300 relative group font-sans text-[#F0EAE6] hover:text-white"
                                >
                                    {item.title}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-500 ease-out group-hover:w-full" />
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <LanguageSwitch />

                    <button
                        onClick={openSearch}
                        className="text-[#F0EAE6] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <Search strokeWidth={1} className="w-5 h-5" />
                    </button>

                    <button
                        onClick={openCart}
                        className="text-[#F0EAE6] hover:text-white transition-all duration-300 relative group hover:scale-105 active:scale-95"
                    >
                        <ShoppingBag strokeWidth={1} className="w-4 h-4" />
                        <Suspense fallback={null}>
                            <Await resolve={rootData?.cart}>
                                {(cart: any) =>
                                    cart?.totalQuantity ? (
                                        <span className="absolute -top-2 -right-2 text-[8px] bg-[#8B5E3C] text-white rounded-full w-3 h-3 flex items-center justify-center">
                                            {cart.totalQuantity}
                                        </span>
                                    ) : null
                                }
                            </Await>
                        </Suspense>
                    </button>
                </div>
            </div>
        </header>
    );
}
