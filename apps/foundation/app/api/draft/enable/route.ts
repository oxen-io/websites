import { createEnableDraftHandler } from '@session/sanity-cms/api/enable-draft';
import { client } from '@/lib/sanity/sanity.client';

const SANITY_API_READ_TOKEN = process.env.SANITY_API_READ_TOKEN!;
if (!SANITY_API_READ_TOKEN) {
  throw new Error('SANITY_API_READ_TOKEN is not defined');
}

export const { GET } = createEnableDraftHandler({
  client,
  draftToken: SANITY_API_READ_TOKEN,
});
