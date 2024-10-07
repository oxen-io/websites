import PortableText from '@/components/PortableText';
import { getLocale, getTranslations } from 'next-intl/server';
import { Button } from '@session/ui/ui/button';
import { cn } from '@session/ui/lib/utils';
import { getLangDir } from 'rtl-detect';
import Link from 'next/link';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { SANITY_SCHEMA_URL } from '@/lib/constants';
import type { FormattedPostType } from '@session/sanity-cms/queries/getPost';
import { notFound } from 'next/navigation';
import logger from '@/lib/logger';
import PostInfoBlock from '@/app/(Site)/blog/[slug]/PostInfoBlock';
import HeadingOutline from '@/app/(Site)/blog/[slug]/HeadingOutline';

export type PostProps = {
  post: FormattedPostType;
};

export default async function BlogPost({ post }: PostProps) {
  const blogDictionary = await getTranslations('blog');
  const locale = await getLocale();
  const direction = getLangDir(locale);

  const body = post.body;

  if (!body) {
    logger.error(`No body found for post: ${post.slug}`);
    return notFound();
  }

  const allH2s = body.filter((block) => block._type === 'block' && block.style === 'h2');

  const headings: Array<string> = allH2s
    .map((block) =>
      'children' in block && Array.isArray(block.children) ? block.children[0].text : null
    )
    .filter(Boolean);

  return (
    <article className="mx-auto mb-32 mt-4 flex max-w-screen-xl flex-col">
      <Link href={SANITY_SCHEMA_URL.POST} prefetch>
        <Button
          data-testid={ButtonDataTestId.Back_To_Blog}
          className={cn('text-session-text-black-secondary my-2 gap-2 fill-current px-1')}
          size="sm"
          rounded="md"
          variant="ghost"
        >
          <span className={cn(direction === 'rtl' && 'rotate-180')}>←</span>
          {blogDictionary('backToBlog')}
        </Button>
      </Link>
      <PostInfoBlock
        className="w-full"
        postInfo={post}
        renderWithPriority
        mobileImagePosition="below"
      />
      <div className="mt-6 flex flex-row gap-12 md:mt-12">
        <PortableText body={body} className="max-w-screen-md" wrapperComponent="section" />
        {headings.length ? (
          <HeadingOutline headings={headings} title={blogDictionary('inThisArticle')} />
        ) : null}
      </div>
    </article>
  );
}
