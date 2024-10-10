'use client';

import { NextIntlClientProvider } from 'next-intl';

/** TODO: This was copied from the staking portal, investigate if we can turn it into a shared library */

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export type LocalizationProviderProps = Parameters<typeof NextIntlClientProvider>[0];

export default function LocalizationProvider({
  messages,
  locale,
  children,
}: LocalizationProviderProps) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}
