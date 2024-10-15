import { Social, SocialLink } from '@session/ui/components/SocialLinkList';

export const BASE_URL = `https://session.foundation`;

export const SOCIALS = {
  [Social.Github]: { name: Social.Github, link: 'https://github.com/oxen-io/websites' },
} satisfies Partial<Record<Social, SocialLink>>;

export enum SANITY_SCHEMA_URL {
  PAGE = '/',
  POST = '/blog/',
}

export enum BLOG {
  /** The number of posts to prefetch on the blog grid page */
  POSTS_TO_PREFETCH = 3,
}

export enum SANITY_UTIL_PATH {
  STUDIO = '/studio',
  DISABLE_DRAFT = '/api/draft/disable',
  ENABLE_DRAFT = '/api/draft/enable',
}

/**
 * Next.js catch-all routes catch literally everything, so we need to define patterns to ignore
 */
export const NEXTJS_EXPLICIT_IGNORED_ROUTES = [
  'favicon.ico',
  'favicon-48x48.png',
  'favicon.svg',
  'apple-touch-icon.png',
  'site.webmanifest',
];

export const NEXTJS_IGNORED_PATTERNS = [
  '.css',
  '.svg',
  '.ico',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.js',
  '.mjs',
  '.map',
  '.xml',
  '.json',
  '_next',
];
