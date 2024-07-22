'use client';

import { defaultTranslationValues } from '@/lib/locale-defaults';
import { NextIntlClientProvider } from 'next-intl';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export type LocalizationProviderProps = Parameters<typeof NextIntlClientProvider>[0];

export default function LocalizationProvider({
  messages,
  locale,
  children,
}: LocalizationProviderProps) {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      timeZone={timeZone}
      defaultTranslationValues={defaultTranslationValues}
    >
      {children}
    </NextIntlClientProvider>
  );
}
