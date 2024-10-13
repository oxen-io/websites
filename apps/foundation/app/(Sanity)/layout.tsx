import type { ReactNode } from 'react';
import '@session/ui/styles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'STF | Sanity Studio',
};

export default function SanityLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
