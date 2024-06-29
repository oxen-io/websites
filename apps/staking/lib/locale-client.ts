'use client';

import {
  FormatDistanceStrictOptions,
  FormatDistanceToNowStrictOptions,
  formatDistanceStrict,
  formatDistanceToNowStrict,
} from 'date-fns';
import { useLocale as _useLocale } from 'next-intl';
import { getDateFnsLocale, type Locale } from './locale-util';

const useLocale = (): Locale => _useLocale() as Locale;

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

type LocalizedNumberOptions = Parameters<typeof Intl.NumberFormat>[1];

export const formatNumber = (num: number, options: LocalizedNumberOptions) => {
  const locale = useLocale();
  return new Intl.NumberFormat(locale, options).format(num);
};

export const formatPercentage = (num: number, options?: LocalizedNumberOptions) => {
  return formatNumber(num, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
};
