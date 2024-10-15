import { createRevalidateHandler } from '@session/sanity-cms/api/revalidate';
import { SANITY_SCHEMA_URL } from '@/lib/constants';
import { generateRssFeed } from '@/lib/rss';

const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET!;
if (!SANITY_REVALIDATE_SECRET) {
  throw new Error('SANITY_REVALIDATE_SECRET is not defined');
}

export const { POST } = createRevalidateHandler({
  revalidateSecret: SANITY_REVALIDATE_SECRET,
  schemaUrls: {
    page: SANITY_SCHEMA_URL.PAGE,
    post: SANITY_SCHEMA_URL.POST,
  },
  rssGenerators: [
    {
      _type: 'post',
      generateRssFeed,
    },
  ],
});
