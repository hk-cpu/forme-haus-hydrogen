import {useRouteLoaderData} from '@remix-run/react';

import type {RootLoader} from '~/root';
import {DEFAULT_LOCALE} from '~/lib/utils';
import {translations, type TranslationKey} from '~/lib/translations';

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

  function t(
    key: TranslationKey | string,
    defaultValue?: string,
    options?: Record<string, any>,
  ): string {
    let result = (translations[lang][key as TranslationKey] ??
      translations.EN[key as TranslationKey] ??
      defaultValue ??
      key) as string;

    if (options && typeof result === 'string') {
      Object.entries(options).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
    }

    return result;
  }

  return {t, lang, isRTL, dir: isRTL ? ('rtl' as const) : ('ltr' as const)};
}
