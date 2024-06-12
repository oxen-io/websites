'use client';
import { GenericStakedNode, StakedNode, StakedNodeCard } from '@/components/StakedNodeCard';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { ServiceNode } from '@session/sent-staking-js';
import {
  ModuleGridContent,
  ModuleGridHeader,
  ModuleGridTitle,
} from '@session/ui/components/ModuleGrid';
import { Loading } from '@session/ui/components/loading';
import { Switch } from '@session/ui/ui/switch';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

export default function StakedNodesModule() {
  const dictionary = useTranslations('modules.stakedNodes');
  const { address } = useAccount();
  return (
    <>
      <ModuleGridHeader>
        <ModuleGridTitle>{dictionary('title')}</ModuleGridTitle>
        <div className="flex flex-row gap-2 align-middle">
          Show Hidden <Switch />
        </div>
      </ModuleGridHeader>
      {address ? <StakedNodesWithAddress address={address} /> : <Loading />}
    </>
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
    requiresLiquidation: node.awaiting_liquidation,
    // canRestake: node.can_restake, FRONT END WORK CAN THIS OUT
    ...(node.requested_unlock_height
      ? {
          deregistrationDate: new Date(Date.now() + msToBlockHeight(node.requested_unlock_height)),
        }
      : {}),
  };
};

function StakedNodesWithAddress({ address }: { address: string }) {
  const { data } = useSessionStakingQuery({
    query: 'getNodesForEthWallet',
    args: { address },
  });
  return (
    <ModuleGridContent className="h-full overflow-y-auto">
      {data
        ? data.nodes.map((node) => (
            <StakedNodeCard
              key={node.service_node_pubkey}
              node={parseSessionNodeData(node) as StakedNode}
            />
          ))
        : null}
    </ModuleGridContent>
  );
}
