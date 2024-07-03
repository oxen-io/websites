'use client';

import Loading from '@/app/loading';
import { GenericStakedNode, StakedNode, StakedNodeCard } from '@/components/StakedNodeCard';
import { WalletModalButtonWithLocales } from '@/components/WalletModalButtonWithLocales';
import { internalLink } from '@/lib/locale-defaults';
import { FEATURE_FLAG, useFeatureFlag } from '@/providers/feature-flag-provider';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import type { ServiceNode } from '@session/sent-staking-js/client';
import { generateMockNodeData } from '@session/sent-staking-js/test';
import {
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridInfoContent,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { Button } from '@session/ui/ui/button';
import { Switch } from '@session/ui/ui/switch';
import { useToggleWalletModal } from '@session/wallet/hooks/wallet-hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

function StakedNodesWithAddress({ address }: { address: string }) {
  const showMockNodes = useFeatureFlag(FEATURE_FLAG.MOCK_STAKED_NODES);
  const showNoNodes = useFeatureFlag(FEATURE_FLAG.MOCK_NO_STAKED_NODES);

  if (showMockNodes && showNoNodes) {
    console.error('Cannot show mock nodes and no nodes at the same time');
  }

  const { data, isLoading } = useSessionStakingQuery({
    query: 'getNodesForEthWallet',
    args: { address },
  });

  const nodes = useMemo(() => {
    if (showMockNodes) {
      return generateMockNodeData({ userAddress: address }).nodes;
    } else if (showNoNodes) {
      return [] as Array<ServiceNode>;
    }
    return data?.nodes as Array<ServiceNode>;
  }, [data, showMockNodes, showNoNodes]);

  return (
    <ModuleGridContent className="h-full md:overflow-y-auto">
      {isLoading ? (
        <Loading />
      ) : nodes && nodes.length > 0 ? (
        nodes.map((node) => (
          <StakedNodeCard
            key={node.service_node_pubkey}
            node={parseSessionNodeData(node) as StakedNode}
          />
        ))
      ) : (
        <NoNodes />
      )}
    </ModuleGridContent>
  );
}

export default function StakedNodesModule() {
  const dictionary = useTranslations('modules.stakedNodes');
  const { address } = useAccount();
  return (
    <>
      <ModuleGridHeader>
        <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
        <div className="flex flex-row gap-2 align-middle">
          <span className="hidden sm:block">{dictionary('showHiddenText')}</span> <Switch />
        </div>
      </ModuleGridHeader>
      {address ? <StakedNodesWithAddress address={address} /> : <NoWallet />}
    </>
  );
}

function NoWallet() {
  const dictionary = useTranslations('modules.stakedNodes');
  return (
    <ModuleGridInfoContent>
      <p>{dictionary('noWalletP1')}</p>
      <p>
        {dictionary.rich('noWalletP2', {
          link: (children) => {
            const { open } = useToggleWalletModal();
            return (
              <a onClick={() => open()} className="text-session-green cursor-pointer underline">
                {children}
              </a>
            );
          },
        })}
      </p>
      <WalletModalButtonWithLocales rounded="md" size="lg" />
    </ModuleGridInfoContent>
  );
}

function NoNodes() {
  const dictionary = useTranslations('modules.stakedNodes');
  return (
    <ModuleGridInfoContent>
      <p>{dictionary('noNodesP1')}</p>
      <p>{dictionary.rich('noNodesP2', { link: internalLink('/stake') })}</p>
      <Link href="/stake" prefetch>
        <Button
          aria-label={dictionary('stakeNowButtonAria')}
          data-testid={ButtonDataTestId.My_Stakes_Stake_Now}
          rounded="md"
          size="lg"
        >
          {dictionary('stakeNowButtonText')}
        </Button>
      </Link>
    </ModuleGridInfoContent>
  );
}

// TODO - replace these with real values
const currentBlockHeight = 1000;
const blocksPerMs = 0.00001;

const msToBlockHeight = (height: number) => {
  return Math.floor((currentBlockHeight + height) / blocksPerMs);
};

const parseSessionNodeData = (node: ServiceNode): GenericStakedNode => {
  return {
    state: node.state,
    contributors: node.contributors,
    lastRewardHeight: 0,
    lastUptime: new Date(Date.now() - msToBlockHeight(node.last_uptime_proof)),
    pubKey: node.service_node_pubkey,
    balance: node.total_contributed,
    operatorFee: node.portions_for_operator,
    operator_address: node.operator_address,
    ...(node.awaiting_liquidation ? { awaitingLiquidation: true } : {}),
    ...(node.decomm_blocks_remaining
      ? {
          deregistrationDate: new Date(Date.now() + msToBlockHeight(node.decomm_blocks_remaining)),
        }
      : {}),
    ...(node.requested_unlock_height
      ? {
          unlockDate: new Date(Date.now() + msToBlockHeight(node.requested_unlock_height)),
        }
      : {}),
  };
};
