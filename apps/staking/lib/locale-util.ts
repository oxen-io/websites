import * as dateFnsLocales from 'date-fns/locale';

export type LocaleKey = IntlMessages;

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
const DATE_FNS_DEFAULT_LOCALE = dateFnsLocales.enUS;

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

export const dateFnsLocaleOverride: Partial<Record<Locale, dateFnsLocales.Locale>> = {
  [Locale.en]: dateFnsLocales.enUS,
  /** TODO - Check this */
  [Locale.es_419]: dateFnsLocales.es,
  [Locale.fa]: dateFnsLocales.faIR,
  /** TODO - Check this */
  [Locale.fil]: dateFnsLocales.fi,
  /** TODO - Check this */
  [Locale.kmr]: dateFnsLocales.km,
  /** TODO - Find this */
  [Locale.no]: DATE_FNS_DEFAULT_LOCALE,
  /** TODO - Find this */
  [Locale.pa]: DATE_FNS_DEFAULT_LOCALE,
  [Locale.pt_PT]: dateFnsLocales.pt,
  /** TODO - Find this */
  [Locale.si]: DATE_FNS_DEFAULT_LOCALE,
  /** TODO - Find this */
  [Locale.tl]: DATE_FNS_DEFAULT_LOCALE,
};

export function getDateFnsLocale(locale: Locale) {
  const localeOverride = dateFnsLocaleOverride[locale];
  if (localeOverride) {
    return localeOverride;
  }

  try {
    const dateFnsLocaleKey = locale.replace('_', '-') as keyof typeof dateFnsLocales;
    const dateFnsLocale = dateFnsLocales[dateFnsLocaleKey];
    if (dateFnsLocale) {
      return dateFnsLocale;
    }
  } catch (error) {
    console.error(`Failed to find date-fns locale for ${locale}`);
  }

  return DATE_FNS_DEFAULT_LOCALE;
}
