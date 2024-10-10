import 'server-only';

/** TODO: This was copied from the staking portal, investigate if we can turn it into a shared library */
import { getMessages, getRequestConfig as i18nGetRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { getLangDir } from 'rtl-detect';
import { DEFAULT_LOCALE, matchClosestLocale } from './locale-util';

export const getServerSideLocale = () => {
  const acceptLanguage = headers().get('accept-language');
  return matchClosestLocale(acceptLanguage);
};

export const getLocalizationData = async () => {
  // TODO: remove when we add localized strings
  // const locale = await getLocale();
  const locale = DEFAULT_LOCALE;
  const direction = getLangDir(locale);
  const messages = await getMessages();
  return { locale, direction, messages };
};

const getRequestConfig: ReturnType<typeof i18nGetRequestConfig> = i18nGetRequestConfig(async () => {
  // TODO: remove when we add localized strings
  // const locale = getServerSideLocale();
  const locale = DEFAULT_LOCALE;
  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});

export default getRequestConfig;
