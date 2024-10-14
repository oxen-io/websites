import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { PostSchemaType } from '../schemas/post';
import type { AuthorSchemaType } from '../schemas/author';

const QUERY_GET_POSTS_WITH_SLUG = groq`*[_type == 'post' && slug.current == $slug]{ ..., author -> {...}}`;
export type FormattedPostType = Omit<PostSchemaType, 'author' | 'date'> & {
  author: AuthorSchemaType | undefined;
  date: Date;
  tags: Array<string>;
};
type QUERY_GET_POSTS_WITH_SLUG_RETURN_TYPE = Array<FormattedPostType>;

export async function getPostBySlug({
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

  const [err, result] = await client.nextFetch<QUERY_GET_POSTS_WITH_SLUG_RETURN_TYPE>({
    query: QUERY_GET_POSTS_WITH_SLUG,
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
    logger.info(`No post found for slug ${slug}`);
    return null;
  }

  return {
    ...page,
    date: new Date(page.date),
  };
}

const QUERY_GET_POSTS_WITH_ID = groq`*[_type == 'post' && _id == $id]`;

export async function getPostById({ client, id }: { client: SessionSanityClient; id: string }) {
  if (!id || id.length === 0) {
    logger.warn(`No id provided, returning null`);
    return null;
  }

  const [err, result] = await client.nextFetch<QUERY_GET_POSTS_WITH_SLUG_RETURN_TYPE>({
    query: QUERY_GET_POSTS_WITH_ID,
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
    logger.info(`No post found for id ${id}`);
    return null;
  }

  return page;
}
