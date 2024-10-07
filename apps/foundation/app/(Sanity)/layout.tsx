import type { ReactNode } from 'react';
import '@session/ui/styles';

export default function SanityLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
