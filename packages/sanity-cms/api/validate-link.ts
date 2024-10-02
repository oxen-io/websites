import { NextRequest, NextResponse } from 'next/server';
import logger from '../lib/logger';
import { safeTry } from '@session/util-js/try';

type CreateValidateLinkHandlerOptions = {
  draftToken: string;
};

export const createValidateLinkHandler = ({ draftToken }: CreateValidateLinkHandlerOptions) => {
  if (!draftToken) {
    throw new TypeError('Missing draftToken');
  }

  const validateLinkHandler = async (req: NextRequest) => {
    const urlToCheck = req.nextUrl.searchParams.get('urlToCheck') as string;

    if (!urlToCheck) {
      return new NextResponse('Missing urlToCheck', { status: 400 });
    }

    logger.info(`Checking URL: ${urlToCheck}`);
    const [error, checkedRes] = await safeTry(fetch(urlToCheck));

    if (error) {
      console.error(error);
      return new NextResponse(error.message, { status: 404 });
    }

    if (!checkedRes.ok) {
      return new NextResponse(checkedRes.statusText, { status: checkedRes.status });
    }

    return new NextResponse('URL valid', { status: 200 });
  };

  return { GET: validateLinkHandler };
};
