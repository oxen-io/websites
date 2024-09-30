import { createClient, SanityClient } from 'next-sanity';
import { type SanityFetch, sanityFetchGeneric, type SanityFetchOptions } from './fetch';
import logger from './logger';

export type CreateSanityClientOptions = {
  projectId: string;
  dataset: string;
  /** @see https://www.sanity.io/docs/api-versioning */
  apiVersion: string;
  draftToken?: string;
};

export type SessionSanityClient = Omit<SanityClient, 'fetch'> & {
  fetch: SanityFetch;
};

/**
 * Create a new Sanity client with all the required options.
 * @param projectId - The Sanity project ID.
 * @param dataset - The dataset name of the Sanity project.
 * @param apiVersion - The API version used.
 * @param draftToken - The draft token of the Sanity project.
 */
export function createSanityClient({
  projectId,
  dataset,
  apiVersion,
  draftToken,
}: CreateSanityClientOptions): SessionSanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });

  if (!draftToken) {
    logger.warn('No draft token provided, draft mode will be disabled');
  }

  /** This is required to make TS happy about replacing the `fetch` method on the client */
  const sessionSanityClient = client as unknown as SessionSanityClient;

  sessionSanityClient.fetch = async <const QueryString extends string>({
    query,
    params = {},
    revalidate,
    tags,
    isClient = false,
  }: SanityFetchOptions<QueryString>) =>
    sanityFetchGeneric<QueryString>({
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
