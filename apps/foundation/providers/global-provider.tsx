import LocalizationProvider, { LocalizationProviderProps } from '@/providers/localization-provider';
import '@session/ui/styles';
import type { ReactNode } from 'react';
import SanityLayout from '@session/sanity-cms/components/SanityLayout';
import { SANITY_UTIL_PATH } from '@/lib/constants';

type GlobalProviderParams = Pick<LocalizationProviderProps, 'locale' | 'messages'> & {
  children: ReactNode;
};

export async function GlobalProvider({ children, messages, locale }: GlobalProviderParams) {
  return (
    <LocalizationProvider messages={messages} locale={locale}>
      <SanityLayout disableDraftModePath={SANITY_UTIL_PATH.DISABLE_DRAFT}>{children}</SanityLayout>
    </LocalizationProvider>
  );
}
