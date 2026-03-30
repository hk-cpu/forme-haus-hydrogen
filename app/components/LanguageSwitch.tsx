import {useNavigate, useLocation, useRouteLoaderData} from '@remix-run/react';

import type {RootLoader} from '~/root';
import {DEFAULT_LOCALE, buildLocalePath} from '~/lib/utils';

export default function LanguageSwitch() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const navigate = useNavigate();
  const location = useLocation();
  const isArabic = locale.language === 'AR';

  function toggleLanguage() {
    const currentPath = location.pathname;
    const search = location.search || '';
    const nextPath = isArabic
      ? buildLocalePath(currentPath)
      : buildLocalePath(currentPath, '/ar-sa');

    navigate(`${nextPath}${search}`);
  }

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2.5 rounded-full border border-[#a87441]/30 bg-[#a87441]/5 px-4 py-2 transition-all duration-300 hover:border-[#a87441]/70 hover:bg-[#a87441]/15"
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      type="button"
    >
      <span
        className={`text-[11px] uppercase tracking-[0.15em] ${
          !isArabic ? 'font-medium text-[#a87441]' : 'font-light text-[#F0EAE6]'
        }`}
      >
        EN
      </span>
      <span className="h-3.5 w-px bg-[#a87441]/40" />
      <span
        className={`text-[12px] ${
          isArabic ? 'font-medium text-[#a87441]' : 'font-light text-[#F0EAE6]'
        }`}
        style={{fontFamily: '"Noto Sans Arabic", "Segoe UI", sans-serif'}}
      >
        عربي
      </span>
    </button>
  );
}
