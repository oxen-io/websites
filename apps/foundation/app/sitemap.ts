import type { MetadataRoute } from 'next';
import { getPostsWithMetadata } from '@session/sanity-cms/queries/getPosts';
import { client } from '@/lib/sanity/sanity.client';
import { getPagesInfo } from '@session/sanity-cms/queries/getPages';
import { BASE_URL, SANITY_SCHEMA_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages] = await Promise.all([
    getPostsWithMetadata({ client }),
    getPagesInfo({ client }),
  ]);

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...pages.map((page) => ({
      url: `${BASE_URL}${page.slug.current}`,
      lastModified: page._updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    {
      url: `${BASE_URL}${SANITY_SCHEMA_URL.POST}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${BASE_URL}${SANITY_SCHEMA_URL.POST}${post.slug.current}`,
      lastModified: post._updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
