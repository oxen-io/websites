import fs from 'fs';
import { generateXMLFromObject } from '@session/sanity-cms/lib/xml';
import { getSiteSettings } from '@session/sanity-cms/queries/getSiteSettings';
import { client } from '@/lib/sanity/sanity.client';
import { BASE_URL, SANITY_SCHEMA_URL } from '@/lib/constants';
import { getPostsWithMetadata } from '@session/sanity-cms/queries/getPosts';

export async function generateRssFeed() {
  const posts = await getPostsWithMetadata({ client });

  posts.sort((a, b) => {
    const dateA = new Date(a.date ?? a._updatedAt);
    const dateB = new Date(b.date ?? b._updatedAt);

    return dateB.getTime() - dateA.getTime();
  });

  const date = new Date();

  const settings = await getSiteSettings({ client });

  const copyright = settings?.copyright;

  const title =
    settings?.blogSeo?.metaTitle ??
    settings?.blogSeo?.openGraph?.title ??
    settings?.seo?.metaTitle ??
    settings?.seo?.openGraph?.title;

  const json = {
    rss: {
      '@version': '2.0',
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      channel: {
        title,
        description: 'RSS feed for Session Technology Foundation updates.',
        link: BASE_URL,
        image: {
          url: `${BASE_URL}/images/logo.svg`,
          title: `Session Technology Foundation updates`,
          link: BASE_URL,
        },
        generator: 'mini-xml for Node.js',
        lastBuildDate: date,
        'atom:link': {
          '@href': `${BASE_URL}/rss.xml`,
          '@rel': 'self',
          '@type': 'application/rss+xml',
        },
        copyright,
        item: posts.map((post) => {
          const url = `${BASE_URL}${SANITY_SCHEMA_URL.POST}${post.slug.current}`;
          return {
            title: post.title.trim(),
            description: post.summary.trim(),
            link: url,
            guid: {
              '@isPermaLink': 'true',
              '#text': url,
            },
            pubDate: new Date(post.date ?? post._updatedAt),
          };
        }),
      },
    },
  };

  const feed = generateXMLFromObject(json, { pretty: true, indentSpaces: 2 });

  fs.writeFileSync('./public/rss.xml', feed);
}
