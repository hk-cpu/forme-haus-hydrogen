import { useNavigate, useLocation, useRouteLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import type { RootLoader } from '~/root';
import { DEFAULT_LOCALE } from '~/lib/utils';

export default function LanguageSwitch() {
    const rootData = useRouteLoaderData<RootLoader>('root');
    const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
    const navigate = useNavigate();
    const location = useLocation();

    const isArabic = locale.language === 'AR';

    function toggleLanguage() {
        const currentPath = location.pathname;

        if (isArabic) {
            // Switch from Arabic to English: remove /ar-sa prefix
            const newPath = currentPath.replace(/^\/ar-sa/, '') || '/';
            navigate(newPath + location.search);
        } else {
            // Switch to Arabic: add /ar-sa prefix
            const cleanPath = currentPath.replace(/^\/en-sa/, '') || '/';
            navigate(`/ar-sa${cleanPath}${location.search}`);
        }
    }

    return (
        <button
            onClick={toggleLanguage}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F0EAE6]/15 hover:border-[#a87441]/40 transition-all duration-500 group overflow-hidden"
            aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
        >
            {/* Subtle background glow on hover */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.08) 0%, transparent 70%)',
                }}
            />

            {/* EN label */}
            <span
                className={`relative text-[10px] uppercase tracking-[0.15em] font-light transition-all duration-500 ${
                    !isArabic
                        ? 'text-[#a87441]'
                        : 'text-[#F0EAE6]/40 group-hover:text-[#F0EAE6]/70'
                }`}
            >
                EN
            </span>

            {/* Divider line */}
            <span className="relative w-px h-3 bg-[#F0EAE6]/20" />

            {/* AR label */}
            <span
                className={`relative text-[11px] font-light transition-all duration-500 ${
                    isArabic
                        ? 'text-[#a87441]'
                        : 'text-[#F0EAE6]/40 group-hover:text-[#F0EAE6]/70'
                }`}
                style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
            >
                عر
            </span>
        </button>
    );
}
