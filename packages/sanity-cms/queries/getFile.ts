import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { FileSchemaType } from 'sanity';

const QUERY_GET_FILES_WITH_SLUG = groq`*[_type == 'cmsFile' && slug.current == $slug] {..., "src": file.asset -> url}`;
type QUERY_GET_FILES_WITH_SLUG_RETURN_TYPE = Array<
  FileSchemaType & {
    src: string;
    fileName: string;
  }
>;

export async function getFileBySlug({
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

  const [err, result] = await client.nextFetch<QUERY_GET_FILES_WITH_SLUG_RETURN_TYPE>({
    query: QUERY_GET_FILES_WITH_SLUG,
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
    logger.info(`No file found for slug ${slug}`);
    return null;
  }

  return page;
}
