import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { PageSchemaType } from '../schemas/page';

const QUERY_GET_PAGES_SLUGS = groq`*[_type == 'page']{ slug }`;
type QUERY_GET_PAGES_SLUGS_RETURN_TYPE = Array<Pick<PageSchemaType, 'slug' | '_updatedAt'>>;

export async function getPagesSlugs({ client }: { client: SessionSanityClient }) {
  const [err, result] = await client.nextFetch<QUERY_GET_PAGES_SLUGS_RETURN_TYPE>({
    query: QUERY_GET_PAGES_SLUGS,
  });

  if (err) {
    logger.error(err);
    return [];
  }

  return result;
}

const QUERY_GET_PAGES_INFO = groq`*[_type == 'page']{ slug, label }`;
type QUERY_GET_PAGES_INFO_RETURN_TYPE = Array<
  Pick<PageSchemaType, 'slug' | 'label' | '_updatedAt'>
>;

export async function getPagesInfo({ client }: { client: SessionSanityClient }) {
  const [err, result] = await client.nextFetch<QUERY_GET_PAGES_INFO_RETURN_TYPE>({
    query: QUERY_GET_PAGES_INFO,
  });

  if (err) {
    logger.error(err);
    return [];
  }

  return result;
}
