import { getLocalizationData } from '@/lib/locale-server';
import { MonumentExtended, RobotoFlex, SourceSerif } from '@session/ui/fonts';
import '@session/ui/styles';
import { GlobalProvider } from '@/providers/global-provider';
import Header from '@/components/Header';
import { ReactNode } from 'react';
import { cn } from '@session/ui/lib/utils';
import DevSheetServerSide from '@/components/DevSheetServerSide';
import { getInitialSiteDataForSSR } from '@/lib/sanity/sanity-server';
import Head from 'next/head';
import { isProduction } from '@session/util-js/env';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, direction, messages } = await getLocalizationData();
  const { settings } = await getInitialSiteDataForSSR();

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn(RobotoFlex.variable, SourceSerif.variable, MonumentExtended.variable)}
    >
      <Head>
        <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <GlobalProvider messages={messages} locale={locale}>
        <body className="bg-session-white font-roboto-flex text-session-text-black mx-4 flex flex-col items-center overflow-x-hidden">
          <Header {...settings} />
          {children}
          {!isProduction() ? <DevSheetServerSide /> : null}
        </body>
      </GlobalProvider>
    </html>
  );
}
