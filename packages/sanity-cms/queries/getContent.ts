import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';

const QUERY_GET_CONTENTS_WITH_ID = groq`*[_id == $id]`;

export async function getContentById<R>({
  client,
  id,
}: {
  client: SessionSanityClient;
  id: string;
}) {
  if (!id || id.length === 0) {
    logger.warn(`No id provided, returning null`);
    return null;
  }

  const [err, result] = await client.nextFetch<Array<R>>({
    query: QUERY_GET_CONTENTS_WITH_ID,
    params: {
      id: id,
    },
  });

  if (err) {
    logger.error(err);
    return null;
  }

  const content = result[0];

  if (!content) {
    logger.info(`No content found for id ${id}`);
    return null;
  }

  return content;
}
