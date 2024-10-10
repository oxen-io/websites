import type { FilteredResponseQueryOptions, QueryParams, SanityClient } from 'next-sanity';
import { isDraftModeEnabled } from './util';
import { safeTry } from '@session/util-js/try';
import logger from './logger';

/**
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/fetch#optionsnextrevalidate}
 * - `false` - Cache the resource indefinitely. Semantically equivalent to revalidate: Infinity. The HTTP cache may evict older resources over time.
 * - `0` - Prevent the resource from being cached.
 * - `number` - (in seconds) Specify the resource should have a cache lifetime of at most n seconds.
 */
export type NextRevalidate = number | false;

/**
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache}
 *
 * - force-cache (default): Next.js looks for a matching request in its Data Cache.
 *   - If there is a match and it is fresh, it will be returned from the cache.
 *   - If there is no match or a stale match, Next.js will fetch the resource from the remote server and update the cache with the downloaded resource.
 * - no-store: Next.js fetches the resource from the remote server on every request without looking in the cache, and it will not update the cache with the downloaded resource.
 *
 * The native options from the Web fetch API are also supported @see {@link https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache}
 */
export type NextCache =
  | 'default'
  | 'no-store'
  | 'reload'
  | 'no-cache'
  | 'force-cache'
  | 'only-if-cached';

export type SanityFetchOptions<QueryString = string> = {
  query: QueryString;
  params?: QueryParams;
  revalidate?: NextRevalidate;
  tags?: Array<string>;
  isClient?: boolean;
};

/**
 * This type fixes the broken `next-sanity` types. Somebody got a little too excited using and
 * relying on global type declarations and this caused a global type conflicts, forcing the `next`
 * and `cache` properties to be ONLY `undefined` as TS couldn't find the `next property in all
 * @see {RequestInit} declarations (it's only in the next.js declaration, not node, web lib, or
 * workers versions).
 */
type FixedSanityResponseQueryOptions = Omit<FilteredResponseQueryOptions, 'next' | 'cache'> & {
  cache?: RequestCache;
  next?: {
    cache?: NextCache;
    revalidate?: NextRevalidate;
    tags?: string[];
  };
};

export type SanityFetchGenericOptions = {
  globalOptions: {
    client: SanityClient;
    token?: string;
    disableCaching?: boolean;
  };
  fetchOptions: SanityFetchOptions;
};

export const sanityFetchGeneric = async <R = unknown>({
  globalOptions: { client, token, disableCaching },
  fetchOptions: { query, params = {}, revalidate, tags, isClient },
}: SanityFetchGenericOptions) =>
  safeTry<R>(
    (async () => {
      const isDraftMode = !isClient && token && isDraftModeEnabled();

      const perspective = isDraftMode ? 'previewDrafts' : 'published';
      const next = {
        cache: disableCaching ? 'no-store' : 'default',
        revalidate: disableCaching ? 0 : tags?.length ? false : revalidate,
        tags,
      } as const;

      logger.debug(
        `Fetching ${query} with ${isDraftMode ? '(DRAFT)' : ''} ${JSON.stringify({
          params,
          perspective,
          next,
        })}`
      );

      const options = {
        token,
        perspective,
        next,
      } satisfies FixedSanityResponseQueryOptions;

      return client.fetch<R>(
        query,
        params,
        /** @see {FixedSanityResponseQueryOptions} */
        options as unknown as FilteredResponseQueryOptions
      );
    })()
  );
