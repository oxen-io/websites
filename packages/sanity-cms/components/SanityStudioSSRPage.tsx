import { type ReactNode, Suspense } from 'react';

export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export type CreateStudioPageProps = {
  sanityStudio: ReactNode;
  suspenseFallback?: ReactNode;
};

export const SanityStudioSSRPage = ({ sanityStudio, suspenseFallback }: CreateStudioPageProps) => {
  return <Suspense fallback={suspenseFallback}>{sanityStudio}</Suspense>;
};
