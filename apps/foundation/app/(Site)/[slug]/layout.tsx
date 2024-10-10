import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { getInitialSiteDataForSSR } from '@/lib/sanity/sanity-server';

export default async function UniversalPageLayout({ children }: { children: ReactNode }) {
  const { settings } = await getInitialSiteDataForSSR();
  return (
    <>
      {children}
      <Footer className="max-w-screen-md" {...settings} />
    </>
  );
}
