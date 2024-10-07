import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { AuthorSchemaType } from '../schemas/author';

type QUERY_GET_AUTHORS_RETURN_TYPE = Array<AuthorSchemaType>;
const QUERY_GET_AUTHORS_WITH_ID = groq`*[_type == 'post' && _id == $id]`;

export async function getAuthorById({ client, id }: { client: SessionSanityClient; id: string }) {
  if (!id || id.length === 0) {
    logger.warn(`No id provided, returning null`);
    return null;
  }

  const [err, result] = await client.nextFetch<QUERY_GET_AUTHORS_RETURN_TYPE>({
    query: QUERY_GET_AUTHORS_WITH_ID,
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
    logger.info(`No author found for id ${id}`);
    return null;
  }

  return page;
}
