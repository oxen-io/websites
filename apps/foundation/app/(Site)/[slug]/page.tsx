import { getPageBySlug } from '@session/sanity-cms/queries/getPage';
import { client } from '@/lib/sanity/sanity.client';
import { getPagesSlugs } from '@session/sanity-cms/queries/getPages';
import { notFound } from 'next/navigation';
import { getLandingPageSlug } from '@/lib/sanity/sanity-server';
import PortableText from '@/components/PortableText';
import logger from '@/lib/logger';
import { NEXTJS_EXPLICIT_IGNORED_ROUTES, NEXTJS_IGNORED_PATTERNS } from '@/lib/constants';

/**
 * Force static rendering and cache the data of a layout or page by forcing `cookies()`, `headers()`
 * and `useSearchParams()` to return empty values.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic}
 */
export const dynamic = 'force-static';
/**
 * Dynamic segments not included in generateStaticParams are generated on demand.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams}
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getPagesSlugs({ client });
  const slugs = new Set(pages.map((page) => page.slug.current));

  const landingPageSlug = await getLandingPageSlug();
  if (landingPageSlug) {
    slugs.delete(landingPageSlug);
  } else {
    console.warn('No landing page set in settings to statically generate');
  }

  const pagesToGenerate = Array.from(slugs);
  logger.info(`Generating static params for ${pagesToGenerate.length} pages`);
  logger.info(pagesToGenerate);
  return pagesToGenerate;
}

type PageProps = {
  params: { slug?: string };
};

export default async function UniversalPage({ params }: PageProps) {
  const slug = params.slug;
  if (!slug) return notFound();

  if (
    NEXTJS_EXPLICIT_IGNORED_ROUTES.includes(slug) ||
    NEXTJS_IGNORED_PATTERNS.some((pattern) => slug.includes(pattern))
  ) {
    return;
  }

  logger.info(`Generating page for slug ${slug}`);

  const page = await getPageBySlug({
    client,
    slug,
  });

  if (!page) return notFound();

  return <PortableText body={page.body} className="max-w-screen-md" wrapperComponent="main" />;
}
