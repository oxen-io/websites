import { type NextRequest, NextResponse } from 'next/server';
import logger from '../lib/logger';
import { safeTry, safeTrySync } from '@session/util-js/try';
import { getSiteSettings } from '../queries/getSiteSettings';
import type { SessionSanityClient } from '../lib/client';

type CreateValidateLinkHandlerOptions = {
  draftToken: string;
  client: SessionSanityClient;
};

export const createValidateLinkHandler = ({
  draftToken,
  client,
}: CreateValidateLinkHandlerOptions) => {
  if (!draftToken) {
    throw new TypeError('Missing draftToken');
  }

  const validateLinkHandler = async (
    _req: NextRequest,
    { params: { url } }: { params: { url: string } }
  ) => {
    if (!url) {
      return new NextResponse('Missing url', { status: 400 });
    }

    const [decodingError, decodedURL] = safeTrySync(() => decodeURIComponent(url));

    if (decodingError) {
      logger.error(decodingError);
      return new NextResponse('SANITY_SCHEMA_URL invalid', { status: 400 });
    }

    logger.info(`Checking URL: ${decodedURL}`);
    const [error, checkedRes] = await safeTry(fetch(decodedURL));

    if (error) {
      logger.error(error);
      return new NextResponse(error.message, { status: 404 });
    }

    if (!checkedRes.ok) {
      return new NextResponse(checkedRes.statusText, { status: checkedRes.status });
    }

    return new NextResponse('SANITY_SCHEMA_URL valid', { status: 200 });
  };

  const generateStaticParams = async () => {
    const settings = await getSiteSettings({ client });

    const links = new Set<string>();

    if (settings?.headerLinks) {
      settings.headerLinks.forEach((link) => {
        if (link._type === 'externalLink') links.add(link.url);
      });
    }

    if (settings?.footerLinks) {
      settings.footerLinks.forEach((link) => {
        if (link._type === 'externalLink') links.add(link.url);
      });
    }

    const linksArray = Array.from(links);

    logger.info(`Generating static params for ${links.size} links`);
    logger.info(linksArray);

    return linksArray.map((link) => ({ url: encodeURIComponent(link) }));
  };

  return { GET: validateLinkHandler, generateStaticParams };
};
