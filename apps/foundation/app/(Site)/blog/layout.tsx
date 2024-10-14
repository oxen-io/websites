import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { getInitialSiteDataForSSR } from '@/lib/sanity/sanity-server';
import type { Metadata, ResolvingMetadata } from 'next';
import { generateSanityMetadata } from '@session/sanity-cms/lib/metadata';
import { client } from '@/lib/sanity/sanity.client';

export async function generateMetadata(_: object, parent: ResolvingMetadata): Promise<Metadata> {
  const { settings } = await getInitialSiteDataForSSR();

  return settings.blogSeo
    ? await generateSanityMetadata(client, {
        seo: settings.blogSeo,
        parentMetadata: await parent,
        type: 'website',
      })
    : {};
}

export default async function BlogLayout({ children }: { children: ReactNode }) {
  const { settings } = await getInitialSiteDataForSSR();
  return (
    <>
      {children}
      <Footer className="max-w-screen-xl" {...settings} />
    </>
  );
}
