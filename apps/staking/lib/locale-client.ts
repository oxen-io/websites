'use client';

import {
  formatDistanceStrict,
  FormatDistanceStrictOptions,
  formatDistanceToNowStrict,
  FormatDistanceToNowStrictOptions,
} from 'date-fns';
import { useLocale as _useLocale } from 'next-intl';
import { getDateFnsLocale, type Locale } from './locale-util';
import { getDateFromUnixTimestampSeconds } from '@session/util-js/date';

export const useLocale = _useLocale as () => Locale;

export const formatLocalizedRelativeTimeClient = (
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

export const formatLocalizedRelativeTimeToNowClient = (
  date: Date,
  options?: Omit<FormatDistanceToNowStrictOptions, 'locale'>
) => {
  const locale = useLocale();
  return formatDistanceToNowStrict(date, {
    locale: getDateFnsLocale(locale),
    ...options,
  });
};

export const formatLocalizedTimeFromSeconds = (
  seconds: number,
  options?: Omit<FormatDistanceStrictOptions, 'locale'>
) =>
  formatLocalizedRelativeTimeClient(getDateFromUnixTimestampSeconds(seconds), new Date(0), options);

export const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
  const locale = useLocale();
  return new Intl.NumberFormat(locale, options).format(num);
};

export const formatPercentage = (num: number, options?: Intl.NumberFormatOptions) => {
  return formatNumber(num, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
};

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
  const locale = useLocale();
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatList = (list: Array<string>, options?: Intl.ListFormatOptions) => {
  const locale = useLocale();
  return new Intl.ListFormat(locale, options).format(list);
};
