/** TODO: This was copied from the staking portal, investigate if we can turn it into a shared library */

export enum Locale {
  ar = 'ar',
  be = 'be',
  bg = 'bg',
  ca = 'ca',
  cs = 'cs',
  da = 'da',
  de = 'de',
  el = 'el',
  en = 'en',
  eo = 'eo',
  es = 'es',
  es_419 = 'es_419',
  et = 'et',
  fa = 'fa',
  fi = 'fi',
  fil = 'fil',
  fr = 'fr',
  he = 'he',
  hi = 'hi',
  hr = 'hr',
  hu = 'hu',
  hy = 'hy',
  id = 'id',
  it = 'it',
  ja = 'ja',
  ka = 'ka',
  km = 'km',
  kmr = 'kmr',
  kn = 'kn',
  ko = 'ko',
  lt = 'lt',
  lv = 'lv',
  mk = 'mk',
  nb = 'nb',
  nl = 'nl',
  no = 'no',
  pa = 'pa',
  pl = 'pl',
  pt_BR = 'pt_BR',
  pt_PT = 'pt_PT',
  ro = 'ro',
  ru = 'ru',
  si = 'si',
  sk = 'sk',
  sl = 'sl',
  sq = 'sq',
  sr = 'sr',
  sv = 'sv',
  ta = 'ta',
  th = 'th',
  tl = 'tl',
  tr = 'tr',
  uk = 'uk',
  uz = 'uz',
  vi = 'vi',
  zh_CN = 'zh_CN',
  zh_TW = 'zh_TW',
}

export const DEFAULT_LOCALE = Locale.en;

/**
 * Matches the closest locale based on the given locale.
 * If no locale is provided, it returns the default locale. @see {@link DEFAULT_LOCALE}
 * @param locale The locale to match.
 * @returns The closest matched locale.
 */
export function matchClosestLocale(locale?: string | null): Locale {
  if (!locale) {
    return DEFAULT_LOCALE;
  }
  const supported: Set<string> = new Set(Object.values(Locale));

  const userLocale = locale.toLocaleLowerCase();

  if (supported.has(userLocale)) return userLocale as Locale;

  const [language] = userLocale.split('-');
  if (!language) {
    return DEFAULT_LOCALE;
  }

  if (supported.has(language)) {
    return language as Locale;
  }

  return DEFAULT_LOCALE;
}
