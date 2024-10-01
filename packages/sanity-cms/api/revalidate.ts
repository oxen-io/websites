import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import logger from '../lib/logger';
import { safeTry } from '@session/util-js/try';

type WebhookPayload = {
  /** The CMS content type that was published or updated. */
  _type: string;
};

type RssGeneratorConfig = {
  /** The CMS content type that the generator should be run for.*/
  _type: string;
  /**
   * The function that generates the RSS feed. This function should return a
   * Promise that resolves when the feed has been generated.
   */
  generateRssFeed: () => Promise<void>;
};

type CreateRevalidateHandlerOptions = {
  /** The secret used to verify the webhook request. */
  revalidateSecret: string;
  /** An array of RSS generator configurations. {@link RssGeneratorConfig} */
  rssGenerators?: Array<RssGeneratorConfig>;
};

/**
 * Creates a revalidate handler for Sanity CMS content.
 *
 * @param revalidateSecret - The secret used to verify the webhook request.
 * @param rssGenerators - An array of RSS generator configurations. {@link RssGeneratorConfig}
 *
 * @throws {TypeError} If the `revalidateSecret` is not provided.
 * @throws {TypeError} If the `rssGenerators` is not an array.
 * @throws {TypeError} If any of the `rssGenerators` have a `_type` that is not a non-empty string.
 * @throws {TypeError} If any of the `rssGenerators` have a `generateRssFeed` that is not a function.
 * @returns The revalidate handler.
 *
 * @example
 * export const { POST } = createRevalidateHandler({
 *   revalidateSecret: REVALIDATE_SECRET,
 *   rssGenerators: [
 *     {
 *       _type: 'post',
 *       generateRssFeed: async () => {
 *         // Generate the RSS feed
 *       },
 *     },
 *   ],
 * });
 */
export const createRevalidateHandler = ({
  revalidateSecret,
  rssGenerators,
}: CreateRevalidateHandlerOptions) => {
  if (!revalidateSecret) {
    throw new TypeError('Revalidate secret is required to create a revalidate handler');
  }

  const rssGeneratorsMap: Map<string, () => Promise<void>> = new Map();
  if (rssGenerators) {
    if (!Array.isArray(rssGenerators)) {
      throw new TypeError('rssGenerators must be an array');
    }

    if (rssGenerators.length > 0) {
      rssGenerators.forEach(({ _type, generateRssFeed }) => {
        if (typeof _type !== 'string' || _type.length === 0) {
          throw new TypeError('_type must be a non-empty string');
        }

        if (typeof generateRssFeed !== 'function') {
          throw new TypeError('generateRssFeed must be a function');
        }

        rssGeneratorsMap.set(_type, generateRssFeed);
      });
      logger.info(`Creating revalidate handler with rss generators: ${rssGeneratorsMap.keys()}`);
    }
  }

  /**
   * Revalidate the cache for a specific CMS resource
   *
   * This endpoint is used to revalidate the cache for a specific CMS resource.
   * It is called by the CMS when a resource is published or updated. The CMS
   * sends a POST request to this endpoint with a JSON body containing the type
   * of the resource and the ID of the resource. The endpoint then revalidates
   * the cache for the resource and returns a JSON response with the status of the revalidation.
   *
   * @param req - The incoming request with a JSON body containing the type and ID of the resource
   * and a signature to verify the request
   * @returns The result of the revalidation as a JSON response
   */
  const revalidateHandler = async (req: NextRequest) => {
    try {
      if (!revalidateSecret) {
        return new NextResponse('Missing revalidate secret', {
          status: 500,
        });
      }

      const { isValidSignature, body } = await parseBody<WebhookPayload>(req, revalidateSecret);

      if (!isValidSignature) {
        return new NextResponse(
          JSON.stringify({ message: 'Invalid signature', isValidSignature, body }),
          { status: 401 }
        );
      } else if (!body?._type) {
        return new NextResponse(JSON.stringify({ message: 'Bad Request', body }), { status: 400 });
      }

      // If the `_type` is `post`, then all `client.fetch` calls with
      // `{next: {tags: ['post']}}` will be revalidated
      revalidateTag(body._type);

      /**
       * If there are any RSS generators configured, then we revalidate them
       * here. This is useful for when you want to generate RSS feeds for
       * specific content types.
       */
      if (rssGeneratorsMap.size > 0 && rssGeneratorsMap.has(body._type)) {
        const generator = rssGeneratorsMap.get(body._type);
        if (generator) {
          const [err] = await safeTry(generator());
          if (err) console.error(err);
        } else {
          console.error(`No generator found for type ${body._type}`);
        }
      }

      return NextResponse.json({
        status: 200,
        revalidated: true,
        now: Date.now(),
        body,
      });
    } catch (err) {
      logger.error(err);
      return new NextResponse(err instanceof Error ? err.message : 'Internal Server Error', {
        status: 500,
      });
    }
  };

  return { POST: revalidateHandler };
};
