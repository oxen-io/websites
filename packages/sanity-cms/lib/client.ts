import { createClient, SanityClient } from 'next-sanity';
import { sanityFetchGeneric, type SanityFetchOptions } from './fetch';
import logger from './logger';

export type CreateSanityClientOptions = {
  projectId: string;
  dataset: string;
  /** @see https://www.sanity.io/docs/api-versioning */
  apiVersion?: string;
  draftToken?: string;
  studioUrl?: string;
};

export type SessionSanityClient = SanityClient & {
  nextFetch: <R>(options: SanityFetchOptions) => ReturnType<typeof sanityFetchGeneric<R>>;
};

/**
 * Create a new Sanity client with all the required options.
 * @param projectId - The Sanity project ID.
 * @param dataset - The dataset name of the Sanity project.
 * @param apiVersion - The API version used.
 * @param draftToken - The draft token of the Sanity project.
 * @param studioUrl - The URL of the Sanity studio.
 */
export function createSanityClient({
  projectId,
  dataset,
  apiVersion,
  draftToken,
  studioUrl,
}: CreateSanityClientOptions): SessionSanityClient {
  logger.info('Creating Sanity client');
  if (!draftToken) {
    logger.warn('No draft token provided, draft mode will be disabled');
  }

  const client = createClient({
    token: draftToken,
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    stega: {
      enabled: true,
      studioUrl,
    },
  });

  /** This is required to make TS happy about replacing the `fetch` method on the client */
  const sessionSanityClient = client as unknown as SessionSanityClient;

  sessionSanityClient.nextFetch = async <R>({
    query,
    params,
    revalidate,
    tags,
    isClient = false,
  }: SanityFetchOptions) =>
    sanityFetchGeneric<R>({
      client,
      token: draftToken,
      query,
      params,
      revalidate,
      tags,
      isClient,
    });

  return sessionSanityClient;
}
