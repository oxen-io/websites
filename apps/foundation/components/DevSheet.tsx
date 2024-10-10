'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@session/ui/ui/sheet';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SANITY_UTIL_PATH, SOCIALS } from '@/lib/constants';
import { Social } from '@session/ui/components/SocialLinkList';
import type { BuildInfo } from '@session/util-js/build';
import { getEnvironment, isProduction } from '@session/util-js/env';
import { CopyToClipboardButton } from '@session/ui/components/CopyToClipboardButton';
import { getPagesInfo } from '@session/sanity-cms/queries/getPages';
import { Button } from '@session/ui/ui/button';

/** TODO: This was copied from the staking portal, investigate if we can turn it into a shared library */

export function DevSheet({
  buildInfo,
  pages,
  isDraftMode,
}: {
  buildInfo: BuildInfo;
  pages: Awaited<ReturnType<typeof getPagesInfo>>;
  isDraftMode: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Checks for the ctrl + k key combination
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (event.code === 'Escape') {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const { COMMIT_HASH, COMMIT_HASH_PRETTY } = buildInfo.env;

  const textToCopy = useMemo(() => {
    const sections = [
      `Commit Hash: ${COMMIT_HASH}`,
      `Build Env: ${getEnvironment()}`,
      `Is Production: ${isProduction() ? 'True' : 'False'}`,
      `User Agent: ${navigator.userAgent}`,
    ];
    return sections.join('\n');
  }, [navigator.userAgent]);

  return (
    <Sheet open={isOpen}>
      <SheetContent
        closeSheet={() => setIsOpen(false)}
        className="bg-session-white text-session-text-black"
      >
        <SheetHeader>
          <SheetTitle>Welcome to the danger zone</SheetTitle>
          <SheetDescription className="text-session-text-black-secondary">
            This sheet only shows when the site is in development mode.
          </SheetDescription>
          <SheetTitle>
            Build Info{' '}
            {textToCopy ? (
              <CopyToClipboardButton
                className="bg-session-black"
                textToCopy={textToCopy}
                copyToClipboardToastMessage={textToCopy}
                data-testid={'button:dont-worry-about-it'}
              />
            ) : null}
          </SheetTitle>
          <span className="inline-flex justify-start gap-1 align-middle">
            {'Commit Hash:'}
            <Link
              href={`${SOCIALS[Social.Github].link}/commit/${buildInfo.env.COMMIT_HASH}`}
              target="_blank"
              className="text-session-green-dark"
            >
              <span>{COMMIT_HASH_PRETTY}</span>
            </Link>
          </span>
          <span className="inline-flex justify-start gap-1 align-middle">
            {'Build Env:'}
            <span className="text-session-green-dark">{getEnvironment()}</span>
          </span>
          <span className="inline-flex justify-start gap-1 align-middle">
            {'Is Production:'}
            <span className="text-session-green-dark">{isProduction() ? 'True' : 'False'}</span>
          </span>
          <DevSheetCMSNavigator pages={pages} isDraftMode={isDraftMode} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

function DevSheetCMSNavigator({
  pages,
  isDraftMode,
}: {
  pages: Awaited<ReturnType<typeof getPagesInfo>>;
  isDraftMode: boolean;
}) {
  return (
    <>
      <SheetTitle>
        CMS Pages{' '}
        <Link href={SANITY_UTIL_PATH.STUDIO}>
          <Button
            data-testid="button:open-studio-dev-sheet"
            rounded="md"
            size="xs"
            variant="secondary"
          >
            🔗 Open Sanity Studio ↗
          </Button>
        </Link>
      </SheetTitle>
      {isDraftMode ? (
        <a href={SANITY_UTIL_PATH.DISABLE_DRAFT}>
          <Button data-testid={'button:disable-draft-mode'} rounded="md" size="xs">
            Disable Draft Mode
          </Button>
        </a>
      ) : (
        <Link href={SANITY_UTIL_PATH.STUDIO}>
          <Button data-testid={'button:enable-draft-mode'} rounded="md" size="xs">
            Enable Draft Mode in Sanity Studio ↗
          </Button>
        </Link>
      )}
      <div className="flex flex-col gap-2">
        {pages.map(({ slug, label }) => (
          <Link
            key={slug.current}
            href={`/${slug.current}`}
            className="text-session-text-black-secondary inline-flex items-center gap-1 align-middle"
          >
            {label}
            <span className="text-session-text-black-secondary text-xs">{` (/${slug.current})`}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
