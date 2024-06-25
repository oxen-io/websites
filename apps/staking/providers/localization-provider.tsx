'use client';

import { defaultTranslationValues } from '@/lib/locale-defaults';
import { NextIntlClientProvider } from 'next-intl';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function LocalizationProvider({
  messages,
  locale,
  children,
}: Parameters<typeof NextIntlClientProvider>[0]) {
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
