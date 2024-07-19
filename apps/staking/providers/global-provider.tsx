import { NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID } from '@/lib/env';
import FeatureFlagProvider from '@/providers/feature-flag-provider';
import LocalizationProvider, { LocalizationProviderProps } from '@/providers/localization-provider';
import '@session/ui/styles';
import { WalletButtonProvider } from '@session/wallet/providers/wallet-button-provider';
import {
  Web3ModalProvider,
  Web3ModalProviderProps,
} from '@session/wallet/providers/web3-modal-provider';
import QueryProvider from '@/providers/query-provider';
import { ReactNode } from 'react';
import TOSProvider from '@/providers/tos-provider';

type GlobalProviderParams = Omit<Web3ModalProviderProps, 'projectId'> &
  Pick<LocalizationProviderProps, 'locale' | 'messages'> & {
    children: ReactNode;
  };

export async function GlobalProvider({
  children,
  wagmiMetadata,
  initialState,
  messages,
  locale,
}: GlobalProviderParams) {
  return (
    <QueryProvider>
      <FeatureFlagProvider>
        <LocalizationProvider messages={messages} locale={locale}>
          <WalletButtonProvider>
            <Web3ModalProvider
              initialState={initialState}
              wagmiMetadata={wagmiMetadata}
              projectId={NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
            >
              <TOSProvider>{children}</TOSProvider>
            </Web3ModalProvider>
          </WalletButtonProvider>
        </LocalizationProvider>
      </FeatureFlagProvider>
    </QueryProvider>
  );
}
