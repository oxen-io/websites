import { getLandingPageSlug } from '@/lib/sanity/sanity-server';
import UniversalPage, { generateMetadata as generateMetadataUniversalPage } from './[slug]/page';
import UniversalPageLayout from '@/app/(Site)/[slug]/layout';
import type { ResolvingMetadata } from 'next';

/**
 * Force static rendering and cache the data of a layout or page by forcing `cookies()`, `headers()`
 * and `useSearchParams()` to return empty values.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic}
 */
export const dynamic = 'force-static';

export async function generateMetadata(_: object, parent: ResolvingMetadata) {
  const slug = await getLandingPageSlug();

  if (!slug) {
    throw new Error('No landing page set in settings to generate metadata');
  }

  return generateMetadataUniversalPage({ params: { slug } }, parent);
}

export default async function LandingPage() {
  const slug = await getLandingPageSlug();

  if (!slug) {
    throw new Error('No landing page set in settings to statically generate');
  }

  return (
    <UniversalPageLayout>
      <UniversalPage params={{ slug }} />
    </UniversalPageLayout>
  );
}
