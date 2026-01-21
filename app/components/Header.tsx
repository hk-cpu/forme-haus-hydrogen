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
        { id: '1', title: 'New In', to: '/collections/new' },
        { id: '2', title: 'Designers', to: '/pages/designers' }, // Mega Menu Candidate
        { id: '3', title: 'Clothing', to: '/collections/clothing' },
        { id: '4', title: 'Shoes', to: '/collections/shoes' },
    ];

    const items = menu?.items?.length ? menu.items : defaultLinks;

    return (
        <header
            role="banner"
            className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex justify-center left-0 right-0 group
            ${scrolled
                    ? 'top-0 w-full bg-[#121212]/90 backdrop-blur-md py-4 border-b border-white/5'
                    : 'top-0 w-full bg-gradient-to-b from-black/80 to-transparent py-8 hover:bg-black/90'
                }`}
        >
            <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between relative z-50">

                {/* Desktop Navigation - MEGA MENU TRIGGER */}
                <nav className="hidden md:flex items-center gap-10">
                    {items.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="h-full flex items-center relative group/item py-2">
                            <Link
                                to={item.to}
                                className="text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 text-[#F0EAE6]/80 hover:text-[#a87441]"
                            >
                                {item.title}
                            </Link>

                            {/* Mega Menu Dropdown Panel (Placeholder Structure) */}
                            <div className="absolute top-full left-0 pt-8 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 -translate-y-2 group-hover/item:translate-y-0 w-[80vw] max-w-[400px]">
                                {/* This simple dropdown mimics the 'start' of a mega menu. Real nested data would map here. */}
                            </div>
                        </div>
                    ))}

                    {/* Placeholder for "Sale" or Special Link */}
                    <Link to="/collections/sale" className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#a87441] hover:text-white transition-colors">
                        Sale
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-[#F0EAE6]">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Centered Logo */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <Link to="/" className="block relative">
                        <div
                            className={`relative flex items-center justify-center transition-all duration-700 ${scrolled ? 'h-6' : 'h-10'}`}
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
                                className="w-auto h-full object-contain brightness-0 invert"
                                loading="eager"
                            />
                        </div>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex ml-4">
                        <LanguageSwitch />
                    </div>

                    <button
                        onClick={openSearch}
                        className="text-[#F0EAE6] hover:text-[#a87441] transition-colors"
                    >
                        <Search strokeWidth={1} className="w-5 h-5" />
                    </button>

                    <button
                        onClick={openCart}
                        className="text-[#F0EAE6] hover:text-[#a87441] transition-colors relative group"
                    >
                        <ShoppingBag strokeWidth={1} className="w-5 h-5" />
                        <Suspense fallback={null}>
                            <Await resolve={rootData?.cart}>
                                {(cart: any) =>
                                    cart?.totalQuantity ? (
                                        <span className="absolute -top-1 -right-1 text-[9px] bg-[#a87441] text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-medium">
                                            {cart.totalQuantity}
                                        </span>
                                    ) : null
                                }
                            </Await>
                        </Suspense>
                    </button>

                    {/* Account Icon (Desktop) */}
                    <Link to="/account" className="hidden md:block text-[#F0EAE6] hover:text-[#a87441] transition-colors">
                        <span className="w-5 h-5 block bg-white/10 rounded-full hover:bg-[#a87441] transition-colors" />
                    </Link>
                </div>
            </div>

            {/* Mega Menu Backdrop (Global) */}
            <div className="absolute top-full left-0 w-full h-[50vh] bg-[#121212]/95 backdrop-blur-xl border-t border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 delay-100 -z-10 pointer-events-none" />

        </header>
    );
}
