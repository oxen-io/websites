import { type ReactNode, Suspense } from 'react';
import { isDraftModeEnabled } from '../lib/util';
import type { SessionSanityClient } from '../lib/client';
import PreviewProvider from '../providers/PreviewProvider';
import { VisualEditing } from 'next-sanity';

export default async function SanityLayout({
  client,
  token,
  children,
}: {
  client: SessionSanityClient;
  token: string;
  children: ReactNode;
}) {
  const isDraftMode = isDraftModeEnabled();
  return (
    <>
      {isDraftMode && (
        <a
          className="fixed bottom-0 right-0 m-4 bg-blue-500 p-4 text-white"
          href="/api/draft-mode/disable"
        >
          Disable preview mode
        </a>
      )}
      {isDraftMode ? (
        <Suspense fallback={children}>
          <PreviewProvider token={token} client={client}>
            {children}
          </PreviewProvider>
        </Suspense>
      ) : (
        <>{children}</>
      )}
      {isDraftMode ? <VisualEditing /> : null}
    </>
  );
}
