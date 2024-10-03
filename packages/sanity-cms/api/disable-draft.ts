import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const createDisableDraftHandler = () => {
  const enableDraftHandler = async (req: NextRequest) => {
    draftMode().disable();
    return NextResponse.redirect(new URL('/', req.url));
  };
  return { GET: enableDraftHandler };
};
