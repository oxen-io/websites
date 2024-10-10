import { createSanityConfig } from '@session/sanity-cms/lib/config';
import { NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_PROJECT_ID } from '@/lib/env';
import {
  authorSchema,
  pageSchema,
  postSchema,
  siteSchema,
  socialSchema,
  specialSchema,
} from '@session/sanity-cms/schemas';
import { SANITY_UTIL_PATH } from '@/lib/constants';

export const sanityConfig = createSanityConfig({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET,
  paths: {
    studio: SANITY_UTIL_PATH.STUDIO,
    enableDrafts: SANITY_UTIL_PATH.ENABLE_DRAFT,
    disableDrafts: SANITY_UTIL_PATH.DISABLE_DRAFT,
  },
  schemas: [pageSchema, postSchema, authorSchema, socialSchema, specialSchema],
  singletonSchemas: [siteSchema],
});
