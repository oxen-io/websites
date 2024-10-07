import PostInfoBlock from '@/app/(Site)/blog/[slug]/PostInfoBlock';
import { client } from '@/lib/sanity/sanity.client';
import { getPostsWithMetadata } from '@session/sanity-cms/queries/getPosts';
import logger from '@/lib/logger';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG, SANITY_SCHEMA_URL } from '@/lib/constants';
import { cn } from '@session/ui/lib/utils';
import { getTranslations } from 'next-intl/server';
import Typography from '@session/ui/components/Typography';

/**
 * Force static rendering and cache the data of a layout or page by forcing `cookies()`, `headers()`
 * and `useSearchParams()` to return empty values.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic}
 */
export const dynamic = 'force-static';

async function ReadMoreText() {
  const blogDictionary = await getTranslations('blog');
  return (
    <span className="group-hover:border-b-session-green group-hover:text-session-text-black hover:border-b-session-green border-b-session-black mt-1 w-max border-b text-sm group-hover:border-b-2">
      {blogDictionary('readMore')}
    </span>
  );
}

export default async function BlogGridPage() {
  const [latestPost, ...rest] = await getPostsWithMetadata({ client });

  const blogDictionary = await getTranslations('blog');

  if (!latestPost) {
    logger.error('No latest post found');
    return notFound();
  }

  const linkClassName = cn(
    'group',
    'transition-all duration-300 ease-in-out motion-reduce:transition-none',
    '[&_*]:transition-all [&_*]:duration-300 [&_*]:ease-in-out [&_*]:motion-reduce:transition-none',
    '[&_img]:hover:brightness-125 [&_img]:hover:saturate-150 [&_h1]:hover:text-session-green-dark [&_h2]:hover:text-session-green-dark'
  );

  return (
    <main className="mx-auto mt-4 flex max-w-screen-xl flex-col">
      <Link
        href={`${SANITY_SCHEMA_URL.POST}${latestPost.slug.current}`}
        prefetch
        className={linkClassName}
      >
        <PostInfoBlock postInfo={latestPost} renderWithPriority>
          <ReadMoreText />
        </PostInfoBlock>
      </Link>
      <Typography variant="h2" className="mt-12">
        {blogDictionary('morePosts')}
      </Typography>
      <div className="mt-4 grid grid-cols-1 gap-12 md:mt-8 md:grid-cols-3">
        {rest.map((post, index) => (
          <Link
            key={`post-list-${post.slug.current}`}
            href={`${SANITY_SCHEMA_URL.POST}${post.slug.current}`}
            prefetch={index < BLOG.POSTS_TO_PREFETCH}
            className={linkClassName}
          >
            <PostInfoBlock postInfo={post} renderWithPriority columnAlways>
              <ReadMoreText />
            </PostInfoBlock>
          </Link>
        ))}
      </div>
    </main>
  );
}
