import {useNavigate, useLocation, useRouteLoaderData} from '@remix-run/react';
import {motion, AnimatePresence} from 'framer-motion';
import {useState} from 'react';

import type {RootLoader} from '~/root';
import {DEFAULT_LOCALE} from '~/lib/utils';

export default function LanguageSwitch() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check if current language is Arabic
  const isArabic = locale.language === 'AR';

  function toggleLanguage() {
    if (isTransitioning) return;

    const currentPath = location.pathname;
    const search = location.search || '';

    // Supported locale prefixes
    const localePrefixes = [
      '/ar-sa',
      '/en-sa',
      '/en-us',
      '/en-ad',
      '/en-at',
      '/en-au',
    ];

    // Start transition
    setIsTransitioning(true);

    // Add a small delay to show transition effect
    setTimeout(() => {
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

      // Reset transitioning after navigation completes
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
  }

  return (
    <>
      {/* Language Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 z-[9999] bg-[#121212] flex items-center justify-center pointer-events-auto"
          >
            <motion.div
              initial={{scale: 0.9, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              exit={{scale: 1.1, opacity: 0}}
              transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
              className="text-center"
            >
              <img
                src="/brand/logo-icon-only.webp"
                alt="Formé Haus"
                className="w-16 h-16 mx-auto mb-4 opacity-80"
              />
              <motion.div
                className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#a87441] to-transparent mx-auto"
                initial={{scaleX: 0}}
                animate={{scaleX: 1}}
                transition={{duration: 0.4, ease: 'easeInOut'}}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleLanguage}
        disabled={isTransitioning}
        className="relative flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#a87441]/30 hover:border-[#a87441]/70 bg-[#a87441]/5 hover:bg-[#a87441]/15 transition-all duration-500 group overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              : 'text-[#F0EAE6]/70 font-light group-hover:text-[#F0EAE6]/80'
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
              : 'text-[#F0EAE6]/70 font-light group-hover:text-[#F0EAE6]/80'
          }`}
          style={{fontFamily: '"IBM Plex Sans Arabic", sans-serif'}}
        >
          عربي
        </span>
      </button>
    </>
  );
}
