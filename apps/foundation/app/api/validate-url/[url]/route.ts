import { createValidateLinkHandler } from '@session/sanity-cms/api/validate-link';
import { client } from '@/lib/sanity/sanity.client';

const draftToken = process.env.SANITY_API_READ_TOKEN!;

if (!draftToken) {
  throw TypeError('SANITY_API_READ_TOKEN is not defined');
}

export const { GET, generateStaticParams } = createValidateLinkHandler({
  draftToken,
  client,
});
