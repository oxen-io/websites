'use client';
import {
  GenericSessionNode,
  SessionNode,
  StakeCard,
  StakeCardContent,
} from '@/components/SessionNodeCard';
import { useSessionStakingQuery } from '@/providers/sent-staking-provider';
import { ButtonDataTestId } from '@/testing/data-test-ids';
import { ServiceNode } from '@session/sent-staking-js';
import { ModuleGridContent } from '@session/ui/components/ModuleGrid';
import { Loading } from '@session/ui/components/loading';
import { Button } from '@session/ui/ui/button';
import { useAccount } from 'wagmi';

export default function SessionNodes() {
  const { address } = useAccount();
  return address ? <SessionNodesWithAddress address={address} /> : <Loading />;
}

const currentBlockHeight = 1000;
const blocksPerMilisecond = 0.00001;

const milisecondsToBlockHeight = (height: number) => {
  return Math.floor((currentBlockHeight + height) / blocksPerMilisecond);
};

const parseSessionNodeData = (node: ServiceNode): GenericSessionNode => {
  return {
    state: node.state,
    contributors: node.contributors,
    lastRewardHeight: 0,
    lastUptime: new Date(Date.now() - milisecondsToBlockHeight(node.last_uptime_proof)),
    pubKey: node.service_node_pubkey,
    balance: node.total_contributed,
    operatorFee: node.portions_for_operator,
    operator_address: node.operator_address,
    requiresLiquidation: node.awaiting_liquidation,
    // canRestake: node.can_restake, FRONT END WORK THIS OUT
    ...(node.requested_unlock_height
      ? {
          deregistrationDate: new Date(
            Date.now() + milisecondsToBlockHeight(node.requested_unlock_height)
          ),
        }
      : {}),
  };
};

function SessionNodesWithAddress({ address }: { address: string }) {
  const { data } = useSessionStakingQuery({
    query: 'getNodesForEthWallet',
    args: { address },
  });
  return (
    <ModuleGridContent>
      {data
        ? data?.nodes.map((node) => (
            <StakeCard key={node.service_node_pubkey}>
              <StakeCardContent node={parseSessionNodeData(node) as SessionNode} />
            </StakeCard>
          ))
        : null}
      <div className="w-52 self-center">
        <Button data-testid={ButtonDataTestId.New_Stake}></Button>
      </div>
    </ModuleGridContent>
  );
}
