import { isProduction, NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID } from '@/lib/env';
import { getLocalizationData } from '@/lib/locale-server';
import { Toaster } from '@session/ui/components/ui/sonner';
import { AtypDisplay, AtypText, MonumentExtended } from '@session/ui/fonts';

import { DevSheet } from '@/components/DevSheet';
import { siteMetadata, wagmiMetadata } from '@/lib/metadata';
import '@session/ui/styles';
import { createWagmiConfig } from '@session/wallet/lib/wagmi';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import ChainBanner from '@/components/ChainBanner';
import Header from '@/components/Header';
import { GlobalProvider } from '@/providers/global-provider';
import { TOSHandler } from '@/components/TOSHandler';
import { getBuildInfo } from '@session/util/build';

const wagmiConfig = createWagmiConfig({
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  metadata: wagmiMetadata,
});

export async function generateMetadata() {
  return siteMetadata({});
}

const buildInfo = getBuildInfo();

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, direction, messages } = await getLocalizationData();
  const initialWagmiState = cookieToInitialState(wagmiConfig, headers().get('cookie'));

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${AtypDisplay.variable} ${AtypText.variable} ${MonumentExtended.variable}`}
    >
      <GlobalProvider
        messages={messages}
        locale={locale}
        initialState={initialWagmiState}
        wagmiMetadata={wagmiMetadata}
      >
        <body className="bg-session-black text-session-text font-atyp-text overflow-x-hidden">
          <ChainBanner />
          <Header />
          <main>{children}</main>
          <Toaster />
          {!isProduction ? <DevSheet buildInfo={buildInfo} /> : null}
          <TOSHandler />
        </body>
      </GlobalProvider>
    </html>
  );
}
