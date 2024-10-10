'use client';

import SanityStudio from '@session/sanity-cms/components/SanityStudio';
import { sanityConfig } from '@/lib/sanity/sanity.config';

export default function Studio() {
  return <SanityStudio config={sanityConfig} />;
}
