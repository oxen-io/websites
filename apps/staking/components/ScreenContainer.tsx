import type { ReactNode } from 'react';

export default function ScreenContainer({ children }: { children: ReactNode }) {
  return <div className="-mt-header-displacement pt-header-displacement h-dvh">{children}</div>;
}
