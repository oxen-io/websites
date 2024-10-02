import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { PageSchemaType } from '../schemas/page';

const QUERY_GET_PAGES = groq`*[_type == 'page']{ slug, title }`;
type QUERY_GET_PAGES_RETURN_TYPE = Array<Pick<PageSchemaType, 'slug' | 'label'>>;

export async function getPages({ client }: { client: SessionSanityClient }) {
  const [err, result] = await client.nextFetch<QUERY_GET_PAGES_RETURN_TYPE>({
    query: QUERY_GET_PAGES,
  });

  if (err) {
    logger.error(err);
    return [];
  }

  return result;
}
