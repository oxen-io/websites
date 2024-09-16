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
import { useEffect, useMemo, useState } from 'react';
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
import { CopyToClipboardButton } from '@session/ui/components/CopyToClipboardButton';
import {
  formatSENTBigInt,
  useAllowanceQuery,
  useProxyApproval,
} from '@session/contracts/hooks/SENT';
import { addresses, SENT_DECIMALS } from '@session/contracts';
import { LoadingText } from '@session/ui/components/loading-text';
import { Button } from '@session/ui/ui/button';
import { Input } from '@session/ui/ui/input';

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

  const { COMMIT_HASH, COMMIT_HASH_PRETTY } = buildInfo.env;

  const remoteFeatureFlagArray = useMemo(() => (data ? Array.from(data) : []), [data]);

  const textToCopy = useMemo(() => {
    const enabledFeatureFlags = Object.entries(featureFlags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag);
    const sections = [
      `Commit Hash: ${COMMIT_HASH}`,
      `Build Env: ${getEnvironment()}`,
      `Is Production: ${isProduction ? 'True' : 'False'}`,
      `Remote Feature Flags: ${data ? (remoteFeatureFlagArray.length > 0 ? remoteFeatureFlagArray.join(', ') : 'None') : 'Loading...'}`,
      `Feature Flags: ${enabledFeatureFlags.length > 0 ? enabledFeatureFlags.join(', ') : 'None'}`,
      `User Agent: ${navigator.userAgent}`,
    ];
    return sections.join('\n');
  }, [data, featureFlags, remoteFeatureFlagArray, navigator.userAgent]);

  return (
    <Sheet open={isOpen}>
      <SheetContent closeSheet={() => setIsOpen(false)}>
        <SheetHeader>
          <SheetTitle>Welcome to the danger zone</SheetTitle>
          <SheetDescription>
            This sheet only shows when the site is in development mode.
          </SheetDescription>
          <SheetTitle>
            Build Info{' '}
            {data ? (
              <CopyToClipboardButton
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
              className="text-session-green"
            >
              <span>{COMMIT_HASH_PRETTY}</span>
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
              ? remoteFeatureFlagArray.map((flag) => (
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
          <SheetTitle>Contract Actions</SheetTitle>
          <ContractActions />
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

function ContractActions() {
  const [value, setValue] = useState<string>('0');
  const serviceNodeRewardsAddress = addresses.ServiceNodeRewards.testnet;

  const tokenAmount = useMemo(() => BigInt(value) * BigInt(10 ** SENT_DECIMALS), [value]);

  const {
    allowance,
    getAllowance,
    refetch,
    status: allowanceStatus,
  } = useAllowanceQuery({
    contractAddress: serviceNodeRewardsAddress,
  });

  const { approveWrite, resetApprove, status } = useProxyApproval({
    contractAddress: serviceNodeRewardsAddress,
    tokenAmount,
  });

  const handleClick = () => {
    if (status !== 'idle') {
      resetApprove();
    }
    approveWrite();
  };

  useEffect(() => {
    if (!allowance) getAllowance();
  }, [allowance]);

  useEffect(() => {
    if (status === 'success') refetch().then(() => getAllowance());
  }, [status]);

  return (
    <>
      <span className="inline-flex justify-start gap-1 align-middle">
        <span className="inline-flex justify-start gap-1 align-middle">
          {'Allowance:'}
          <span className="text-session-green">
            {allowanceStatus === 'success' ? formatSENTBigInt(allowance) : <LoadingText />}
          </span>
        </span>
      </span>
      <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        data-testid="button:reset-allowance"
        onClick={handleClick}
        size="sm"
        rounded="md"
        disabled={status === 'pending' || tokenAmount === allowance}
      >
        {tokenAmount > BigInt(0) ? 'Set Allowance' : 'Reset Allowance'}
      </Button>
    </>
  );
}
