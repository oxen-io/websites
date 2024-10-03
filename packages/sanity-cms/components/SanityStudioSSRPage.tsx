import { type ReactNode, Suspense } from 'react';

/**
 * Forces the page to be statically rendered.
 *
 * > Force static rendering and cache the data of a layout or page by forcing cookies(), headers()
 * and useSearchParams() to return empty values.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 */
export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export type CreateStudioPageProps = {
  suspenseFallback?: ReactNode;
  sanityStudio: ReactNode;
};

export const SanityStudioSSRPage = ({ sanityStudio, suspenseFallback }: CreateStudioPageProps) => {
  return <Suspense fallback={suspenseFallback}>{sanityStudio}</Suspense>;
};
