'use client';

import { LiveQueryProvider } from '@sanity/preview-kit';
import type { ReactNode } from 'react';
import type { SessionSanityClient } from '../lib/client';
import type { SanityClient } from 'next-sanity';
import logger from '../lib/logger';

export default function PreviewProvider({
  client,
  token,
  children,
}: {
  client: SessionSanityClient;
  token: string;
  children: ReactNode;
}) {
  return (
    <LiveQueryProvider
      token={token}
      /** This is required because we have a better sanity client */
      client={client as unknown as SanityClient}
      /** This is required because we have a better logger */
      logger={logger as unknown as typeof console}
    >
      {children}
    </LiveQueryProvider>
  );
}
