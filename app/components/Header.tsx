import { useState, useEffect, Suspense } from 'react';
import { Link, NavLink, Await, useRouteLoaderData } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useWindowScroll } from 'react-use';
import { motion } from 'framer-motion';
import { useIsHomePath } from '~/lib/utils';
import type { RootLoader } from '~/root';
import LanguageSwitch from './LanguageSwitch';
import type { EnhancedMenu } from '~/lib/utils';
import { useTranslation } from '~/hooks/useTranslation';

export function Header({
    title,
    menu,
    openCart,
    openSearch,
    openMenu,
}: {
    title: string;
    menu?: EnhancedMenu;
    openCart: () => void;
    openSearch: () => void;
    openMenu: () => void;
}) {
    const isHome = useIsHomePath();
    const { y } = useWindowScroll();
    const [scrolled, setScrolled] = useState(false);
    const rootData = useRouteLoaderData<RootLoader>('root');
    const { t } = useTranslation();

    useEffect(() => {
        setScrolled(y > 20);
    }, [y]);

    // Default Nav Links if menu is missing
    const defaultLinks = [
        { id: '1', title: t('nav.newIn'), to: '/collections/new' },
        { id: '2', title: t('nav.designers'), to: '/pages/designers' }, // Mega Menu Candidate
        { id: '3', title: t('nav.clothing'), to: '/collections/clothing' },
        { id: '4', title: t('nav.shoes'), to: '/collections/shoes' },
    ];

    const items = menu?.items?.length ? menu.items : defaultLinks;

    return (
        <header
            role="banner"
            className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex justify-center left-0 right-0 group
            ${scrolled
                    ? 'top-0 w-full bg-[#121212]/95 backdrop-blur-xl py-4 border-b border-[#a87441]/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                    : 'top-0 w-full bg-[#121212]/80 backdrop-blur-md py-6'
                }`}
        >
            <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between relative z-50">

                {/* Desktop Navigation - Left Side */}
                <nav className="hidden md:flex items-center gap-12">
                    {items.map((item: any) => (
                        <div key={item.id} className="h-full flex items-center relative group/item">
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `text-[11px] uppercase tracking-[0.3em] font-light transition-all duration-500 hover:tracking-[0.35em] relative ${
                                        isActive
                                            ? 'text-[#a87441] after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#a87441]'
                                            : 'text-[#F0EAE6]/70 hover:text-[#a87441]'
                                    }`
                                }
                            >
                                {item.title}
                            </NavLink>

                            {/* Compact Dropdown - Only if has children */}
                            {item?.items?.length > 0 && (
                                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 -translate-y-1 group-hover/item:translate-y-0 min-w-[200px]">
                                    <div className="bg-[#1A1A1A]/95 backdrop-blur-xl border border-[#a87441]/20 rounded-lg shadow-2xl shadow-black/50 py-2 overflow-hidden">
                                        {item.items.map((subItem: any) => (
                                            <Link
                                                key={subItem.id}
                                                to={subItem.to}
                                                className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-[#F0EAE6]/80 hover:text-[#a87441] hover:bg-[#a87441]/10 transition-colors"
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Mobile: Menu Toggle + Language */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={openMenu}
                        className="text-[#F0EAE6]/80 hover:text-[#a87441] transition-colors duration-300"
                    >
                        <Menu strokeWidth={1.5} className="w-7 h-7" />
                    </button>
                    <LanguageSwitch />
                </div>

                {/* Centered Logo Icon - hidden initially to avoid overlapping StatusBanner, fades in on scroll */}
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-700 ${scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    <Link to="/" className="block relative group/logo">
                        <div
                            className="relative flex items-center justify-center transition-all duration-700"
                        >
                            <img
                                src="/brand/logo-icon-only.png"
                                alt="FORMÉ HAUS"
                                className="transition-all duration-700 object-contain h-12 w-12 opacity-90 group-hover/logo:opacity-100"
                            />
                            {/* Elegant glow effect on hover */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{
                                    filter: 'blur(24px)',
                                    background: 'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.4) 0%, transparent 70%)',
                                }}
                            />
                        </div>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6 md:gap-8">
                    <div className="hidden md:flex">
                        <LanguageSwitch />
                    </div>

                    <button
                        onClick={openSearch}
                        className="text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 hover:scale-110"
                    >
                        <Search strokeWidth={1.5} className="w-6 h-6" />
                    </button>

                    <button
                        onClick={openCart}
                        className="text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 hover:scale-110 relative group"
                    >
                        <ShoppingBag strokeWidth={1.5} className="w-6 h-6" />
                        <Suspense fallback={null}>
                            <Await resolve={rootData?.cart}>
                                {(cart: any) =>
                                    cart?.totalQuantity ? (
                                        <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-[#a87441] text-white rounded-full w-4.5 h-4.5 flex items-center justify-center font-medium shadow-lg">
                                            {cart.totalQuantity}
                                        </span>
                                    ) : null
                                }
                            </Await>
                        </Suspense>
                    </button>

                    {/* Account Icon (Desktop) */}
                    <Link 
                        to="/account" 
                        className="hidden md:flex items-center justify-center text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 hover:scale-110"
                        aria-label="Account"
                    >
                        <User strokeWidth={1.5} className="w-6 h-6" />
                    </Link>
                </div>
            </div>

        </header>
    );
}
