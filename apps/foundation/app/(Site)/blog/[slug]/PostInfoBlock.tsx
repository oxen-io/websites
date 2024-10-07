import { SanityImage } from '@session/sanity-cms/components/SanityImage';
import { client } from '@/lib/sanity/sanity.client';
import Typography from '@session/ui/components/Typography';
import { getLocale } from 'next-intl/server';
import { cn } from '@session/ui/lib/utils';
import { safeTry } from '@session/util-js/try';
import logger from '@/lib/logger';
import type { FormattedPostType } from '@session/sanity-cms/queries/getPost';
import type { ReactNode } from 'react';

const getLocalizedPosedDate = async (date: Date) => {
  const locale = await getLocale();
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(
    date
  );
};
export type PostBlockProps = {
  postInfo: Pick<FormattedPostType, 'title' | 'summary' | 'featuredImage' | 'author' | 'date'>;
  renderWithPriority?: boolean;
  mobileImagePosition?: 'above' | 'below';
  columnAlways?: boolean;
  className?: string;
  children?: ReactNode;
};

export default async function PostInfoBlock({
  postInfo,
  renderWithPriority,
  mobileImagePosition = 'above',
  columnAlways,
  className,
  children,
}: PostBlockProps) {
  const { title, summary, featuredImage, author, date } = postInfo;

  let localizedPublishedAt = null;
  if (date) {
    const [err, res] = await safeTry(getLocalizedPosedDate(date));
    if (err) {
      logger.error(err);
      localizedPublishedAt = date.toLocaleDateString();
    } else {
      localizedPublishedAt = res;
    }
  }

  return (
    <div
      className={cn(
        'flex w-full items-center gap-8',
        columnAlways ? 'flex-col' : 'md:grid md:grid-cols-2',
        mobileImagePosition === 'below' ? 'flex-col-reverse' : 'flex-col',
        className
      )}
    >
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <SanityImage
          className="h-full"
          client={client}
          value={featuredImage}
          cover
          renderWithPriority={renderWithPriority}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Typography variant={columnAlways ? 'h2' : 'h1'} className="w-full">
          {title}
        </Typography>
        <span className="text-session-text-black-secondary inline-flex w-full gap-1">
          {date ? <time dateTime={date.toISOString()}>{localizedPublishedAt}</time> : null}
          {date ? '/' : null}
          {author?.name ? <address>{author.name}</address> : null}
        </span>
        {summary ? <p className="w-full">{summary}</p> : null}
        {children}
      </div>
    </div>
  );
}
