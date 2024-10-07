import { getLandingPageSlug } from '@/lib/sanity/sanity-server';
import UniversalPage from './[slug]/page';

/**
 * Force static rendering and cache the data of a layout or page by forcing `cookies()`, `headers()`
 * and `useSearchParams()` to return empty values.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic}
 */
export const dynamic = 'force-static';

export default async function LandingPage() {
  const slug = await getLandingPageSlug();

  if (!slug) {
    throw new Error('No landing page set in settings to statically generate');
  }

  return <UniversalPage params={{ slug }} />;
}
