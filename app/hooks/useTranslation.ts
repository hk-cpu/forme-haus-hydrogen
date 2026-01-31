import { useRouteLoaderData } from '@remix-run/react';
import type { RootLoader } from '~/root';
import { DEFAULT_LOCALE } from '~/lib/utils';
import { translations, type TranslationKey } from '~/lib/translations';

/**
 * Returns the current language code based on the selected locale.
 * Defaults to 'EN' if no locale is set.
 */
export function useLanguage(): 'EN' | 'AR' {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  return locale.language === 'AR' ? 'AR' : 'EN';
}

/**
 * Returns a translation function `t(key)` that resolves static UI strings
 * based on the current locale language.
 */
export function useTranslation() {
  const lang = useLanguage();
  const isRTL = lang === 'AR';

  function t(key: TranslationKey): string {
    return translations[lang][key] ?? translations.EN[key] ?? key;
  }

  return { t, lang, isRTL, dir: isRTL ? 'rtl' as const : 'ltr' as const };
}
