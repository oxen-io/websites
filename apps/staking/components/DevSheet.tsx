'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@session/ui/ui/sheet';
import { Switch } from '@session/ui/ui/switch';
import { Tooltip } from '@session/ui/ui/tooltip';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SOCIALS } from '@/lib/constants';
import { Social } from '@session/ui/components/SocialLinkList';
import type { BuildInfo } from '@session/util/build';
import { getEnvironment } from '@session/util/env';
import { isProduction } from '@/lib/env';
import {
  type FEATURE_FLAG,
  FEATURE_FLAG_DESCRIPTION,
  globalFeatureFlags,
  pageFeatureFlags,
  remoteFeatureFlagsInfo,
} from '@/lib/feature-flags';
import {
  useFeatureFlags,
  useRemoteFeatureFlagsQuery,
  useSetFeatureFlag,
} from '@/lib/feature-flags-client';

export function DevSheet({ buildInfo }: { buildInfo: BuildInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const featureFlags = useFeatureFlags();
  const { data } = useRemoteFeatureFlagsQuery();

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

  return (
    <Sheet open={isOpen}>
      <SheetContent closeSheet={() => setIsOpen(false)}>
        <SheetHeader>
          <SheetTitle>Welcome to the danger zone</SheetTitle>
          <SheetDescription>
            This sheet only shows when the site is in development mode.
          </SheetDescription>
          <SheetTitle>Build Info</SheetTitle>
          <span className="inline-flex justify-start gap-1 align-middle">
            {'Commit Hash:'}
            <Link
              href={`${SOCIALS[Social.Github].link}/commit/${buildInfo.env.COMMIT_HASH}`}
              target="_blank"
              className="text-session-green"
            >
              <span>{buildInfo.env.COMMIT_HASH_PRETTY}</span>
            </Link>
          </span>
          <span className="inline-flex justify-start gap-1 align-middle">
            {'Build Env:'}
            <span className="text-session-green">{getEnvironment()}</span>
          </span>
          <span className="inline-flex justify-start gap-1 align-middle">
            {'Is Production:'}
            <span className="text-session-green">{isProduction ? 'True' : 'False'}</span>
          </span>
          <SheetTitle>Remote Feature Flags</SheetTitle>
          <SheetDescription className="flex flex-col gap-2">
            {data
              ? Array.from(data).map((flag) => (
                  <div key={flag}>
                    <span className="font-medium">{'• '}</span>
                    <span className="text-session-green">{remoteFeatureFlagsInfo[flag].name}</span>
                    {': '}
                    <span key={flag}>{remoteFeatureFlagsInfo[flag].description}</span>
                  </div>
                ))
              : 'No remote feature flags enabled'}
          </SheetDescription>
          <SheetTitle>Global Feature Flags</SheetTitle>
          <SheetDescription className="flex flex-col gap-2">
            🧑‍🔬
            {globalFeatureFlags.map((flag) => (
              <FeatureFlagToggle flag={flag} key={flag} initialState={featureFlags[flag]} />
            ))}
          </SheetDescription>
          <PageSpecificFeatureFlags />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

function PageSpecificFeatureFlags() {
  const pathname = usePathname();
  const featureFlags = useFeatureFlags();

  const pageFlags = pathname
    .split('/')
    .flatMap((slug) => pageFeatureFlags[slug])
    .filter((flag) => flag !== undefined) as Array<FEATURE_FLAG>;

  if (!pageFlags || pageFlags.length === 0) return null;

  return (
    <>
      <SheetTitle>Page Specific Feature Flags</SheetTitle>
      <SheetDescription className="flex flex-col gap-2">
        {pageFlags.map((flag) => (
          <FeatureFlagToggle flag={flag} key={flag} initialState={featureFlags[flag]} />
        ))}
      </SheetDescription>
    </>
  );
}

function FeatureFlagToggle({
  flag,
  initialState,
  disabled,
}: {
  flag: FEATURE_FLAG;
  initialState: boolean;
  disabled?: boolean;
}) {
  const { setFeatureFlag } = useSetFeatureFlag();
  return (
    <span className="inline-flex justify-start gap-1 align-middle">
      <Switch
        key={flag}
        defaultChecked={initialState}
        disabled={disabled}
        onCheckedChange={(checked) => {
          setFeatureFlag(flag, checked);
        }}
        className="h-4 w-8 [&>span]:h-4 [&>span]:w-4 [&>span]:data-[state=checked]:translate-x-4"
      />
      <Tooltip tooltipContent={flag}>
        <span className="cursor-pointer">{FEATURE_FLAG_DESCRIPTION[flag]}</span>
      </Tooltip>
    </span>
  );
}
