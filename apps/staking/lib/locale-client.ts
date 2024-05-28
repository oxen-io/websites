'use client';

import {
  FormatDistanceStrictOptions,
  FormatDistanceToNowStrictOptions,
  formatDistanceStrict,
  formatDistanceToNowStrict,
} from 'date-fns';
import { useLocale as nextIntlUseLocale } from 'next-intl';
import { getDateFnsLocale, type Locale } from './locale-util';

export const useLocale = (): Locale => nextIntlUseLocale() as Locale;

export const formatTimeDistanceClient = (
  date: Date,
  baseDate: Date,
  options?: Omit<FormatDistanceStrictOptions, 'locale'>
) => {
  const locale = useLocale();
  return formatDistanceStrict(date, baseDate, {
    locale: getDateFnsLocale(locale),
    ...options,
  });
};

export const formatTimeDistanceToNowClient = (
  date: Date,
  options?: Omit<FormatDistanceToNowStrictOptions, 'locale'>
) => {
  const locale = useLocale();
  return formatDistanceToNowStrict(date, {
    locale: getDateFnsLocale(locale),
    ...options,
  });
};
