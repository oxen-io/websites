import { groq } from 'next-sanity';
import { SessionSanityClient } from '../lib/client';
import logger from '../lib/logger';
import type { PostSchemaType } from '../schemas/post';
import type { AuthorSchemaType } from '../schemas/author';

const QUERY_GET_POSTS_SLUGS = groq`*[_type == 'post']{ slug, label }`;
type QUERY_GET_POSTS_SLUGS_RETURN_TYPE = Array<Pick<PostSchemaType, 'slug'>>;

export async function getPostsSlugs({ client }: { client: SessionSanityClient }) {
  const [err, result] = await client.nextFetch<QUERY_GET_POSTS_SLUGS_RETURN_TYPE>({
    query: QUERY_GET_POSTS_SLUGS,
  });

  if (err) {
    logger.error(err);
    return [];
  }

  return result;
}

const QUERY_GET_POSTS_WITH_METADATA = groq`*[_type == 'post']{ slug, title, summary, date, featuredImage, author -> {...}}`;
type QUERY_GET_POSTS_WITH_METADATA_RETURN_TYPE = Array<
  Omit<PostSchemaType, 'author' | 'body'> & {
    author: AuthorSchemaType | undefined;
    date: Date;
  }
>;

export async function getPostsWithMetadata({ client }: { client: SessionSanityClient }) {
  const [err, result] = await client.nextFetch<QUERY_GET_POSTS_WITH_METADATA_RETURN_TYPE>({
    query: QUERY_GET_POSTS_WITH_METADATA,
  });

  if (err) {
    logger.error(err);
    return [];
  }

  const formattedResult = result.map((post) => {
    return {
      ...post,
      date: new Date(post.date),
    };
  });

  return formattedResult.sort((a, b) => b.date.getTime() - a.date.getTime());
}
