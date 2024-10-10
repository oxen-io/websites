'use client';

import { createSanityConfig } from '@session/sanity-cms/lib/config';
import type { NextStudioProps } from 'next-sanity/studio/client-component';
import { NextStudio } from 'next-sanity/studio';

export type SanityStudioProps = Omit<NextStudioProps, 'config'> & {
  config: ReturnType<typeof createSanityConfig>;
};

export default function SanityStudio(props: SanityStudioProps) {
  return <NextStudio {...props} />;
}
