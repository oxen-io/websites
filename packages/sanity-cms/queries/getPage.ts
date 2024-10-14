import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { PageSchemaType } from '../schemas/page';

const QUERY_GET_PAGES_WITH_SLUG = groq`*[_type == 'page' && slug.current == $slug]`;
type QUERY_GET_PAGES_WITH_SLUG_RETURN_TYPE = Array<PageSchemaType>;

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

  const [err, result] = await client.nextFetch<QUERY_GET_PAGES_WITH_SLUG_RETURN_TYPE>({
    query: QUERY_GET_PAGES_WITH_SLUG,
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

const QUERY_GET_PAGES_WITH_ID = groq`*[_type == 'page' && _id == $id]`;

export async function getPageById({ client, id }: { client: SessionSanityClient; id: string }) {
  if (!id || id.length === 0) {
    logger.warn(`No id provided, returning null`);
    return null;
  }

  const [err, result] = await client.nextFetch<QUERY_GET_PAGES_WITH_SLUG_RETURN_TYPE>({
    query: QUERY_GET_PAGES_WITH_ID,
    params: {
      id: id,
    },
  });

  if (err) {
    logger.error(err);
    return null;
  }

  const page = result[0];

  if (!page) {
    logger.info(`No page found for id ${id}`);
    return null;
  }

  return page;
}
