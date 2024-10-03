import type { FilteredResponseQueryOptions, QueryParams, SanityClient } from 'next-sanity';
import { isDraftModeEnabled } from './util';
import { safeTry } from '@session/util-js/try';
import logger from './logger';

export type SanityFetchOptions<QueryString = string> = {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number;
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
    revalidate?: number | false;
    tags?: string[];
  };
};

export type SanityFetchGenericOptions = SanityFetchOptions & {
  client: SanityClient;
  token?: string;
};

export const sanityFetchGeneric = async <R = unknown>({
  client,
  token,
  query,
  params = {},
  revalidate,
  tags,
  isClient = false,
}: SanityFetchGenericOptions) =>
  safeTry<R>(
    (async () => {
      logger.info(`Fetching ${query} with params ${JSON.stringify(params)}`);
      const isDraftMode = token && isDraftModeEnabled(isClient);

      const options = {
        token,
        perspective: isDraftMode ? 'previewDrafts' : 'published',
        next: {
          revalidate: tags?.length ? false : revalidate,
          tags,
        },
      } satisfies FixedSanityResponseQueryOptions;

      return client.fetch<R>(
        query,
        params,
        /** @see {FixedSanityResponseQueryOptions} */
        options as unknown as FilteredResponseQueryOptions
      );
    })()
  );
