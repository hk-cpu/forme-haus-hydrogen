import {useNavigate, useLocation, useRouteLoaderData} from '@remix-run/react';
import {motion} from 'framer-motion';

import type {RootLoader} from '~/root';
import {DEFAULT_LOCALE} from '~/lib/utils';

export default function LanguageSwitch() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current language is Arabic
  const isArabic = locale.language === 'AR';

  function toggleLanguage() {
    const currentPath = location.pathname;
    const search = location.search || '';

    // Supported locale prefixes
    const localePrefixes = ['/ar-sa', '/en-sa', '/en-us', '/en-ad', '/en-at', '/en-au'];
    
    if (isArabic) {
      // Switch from Arabic to English (default)
      // Remove any locale prefix
      let newPath = currentPath;
      for (const prefix of localePrefixes) {
        newPath = newPath.replace(new RegExp(`^${prefix}`), '');
      }
      // Ensure we have at least a root path
      newPath = newPath || '/';
      navigate(`${newPath}${search}`);
    } else {
      // Switch to Arabic
      // First remove any existing English locale prefix
      let cleanPath = currentPath;
      for (const prefix of localePrefixes) {
        cleanPath = cleanPath.replace(new RegExp(`^${prefix}`), '');
      }
      cleanPath = cleanPath || '/';
      // Add Arabic locale prefix
      navigate(`/ar-sa${cleanPath === '/' ? '' : cleanPath}${search}`);
    }
  }

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#a87441]/30 hover:border-[#a87441]/70 bg-[#a87441]/5 hover:bg-[#a87441]/15 transition-all duration-500 group overflow-hidden cursor-pointer"
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {/* Subtle background glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* EN label */}
      <span
        className={`relative text-[11px] uppercase tracking-[0.15em] transition-all duration-500 ${
          !isArabic
            ? 'text-[#a87441] font-medium'
            : 'text-[#F0EAE6]/50 font-light group-hover:text-[#F0EAE6]/80'
        }`}
      >
        EN
      </span>

      {/* Divider line */}
      <span className="relative w-px h-3.5 bg-[#a87441]/40" />

      {/* AR label */}
      <span
        className={`relative text-[12px] transition-all duration-500 ${
          isArabic
            ? 'text-[#a87441] font-medium'
            : 'text-[#F0EAE6]/50 font-light group-hover:text-[#F0EAE6]/80'
        }`}
        style={{fontFamily: '"IBM Plex Sans Arabic", sans-serif'}}
      >
        عربي
      </span>
    </button>
  );
}
