import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { PageSchemaType } from '../schemas/page';

const QUERY_GET_LIST_OF_PAGE = groq`*[_type == 'page' && slug.current == $slug]`;
type QUERY_GET_LIST_OF_PAGE_RETURN_TYPE = Array<PageSchemaType>;

export async function getPageBySlug({
  client,
  slug,
}: {
  client: SessionSanityClient;
  slug: string;
}) {
  if (!slug || slug.length === 0) {
    logger.warn(`No slug provided, returning null`);
    return null;
  }

  const [err, result] = await client.nextFetch<QUERY_GET_LIST_OF_PAGE_RETURN_TYPE>({
    query: QUERY_GET_LIST_OF_PAGE,
    params: {
      slug: slug,
    },
  });

  if (err) {
    logger.error(err);
    return null;
  }

  const page = result[0];

  if (!page) {
    logger.info(`No page found for slug ${slug}`);
    return null;
  }

  return page;
}
