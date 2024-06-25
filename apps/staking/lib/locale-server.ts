'server only';

import { getLocale, getMessages, getRequestConfig as i18nGetRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { getLangDir } from 'rtl-detect';
import { defaultTranslationValues } from './locale-defaults';
import { matchClosestLocale } from './locale-util';

export const getServerSideLocale = () => {
  const acceptLanguage = headers().get('accept-language');
  return matchClosestLocale(acceptLanguage);
};

export const getLocalizationData = async () => {
  const locale = await getLocale();
  const direction = getLangDir(locale);
  const messages = await getMessages();
  return { locale, direction, messages };
};

const getRequestConfig: ReturnType<typeof i18nGetRequestConfig> = i18nGetRequestConfig(async () => {
  const locale = getServerSideLocale();
  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
    defaultTranslationValues,
  };
});

export default getRequestConfig;
