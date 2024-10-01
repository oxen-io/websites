import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SessionSanityClient } from '../lib/client';
import { SanityClient } from 'next-sanity';

type CreateEnableDraftHandlerOptions = {
  client: SessionSanityClient;
  draftToken: string;
};

export const createEnableDraftHandler = ({
  draftToken,
  client,
}: CreateEnableDraftHandlerOptions) => {
  if (!draftToken) {
    throw new TypeError('Missing draftToken');
  }

  const enableDraftHandler = async (req: NextRequest) => {
    const { isValid, redirectTo = '/' } = await validatePreviewUrl(
      /** This is required to make TS happy about replacing the `fetch` method on the client */
      client as unknown as SanityClient,
      req.url
    );

    if (!isValid) {
      return new NextResponse('Invalid secret', { status: 401 });
    }

    draftMode().enable();
    return NextResponse.redirect(new URL(redirectTo, req.url));
  };

  return { GET: enableDraftHandler };
};
