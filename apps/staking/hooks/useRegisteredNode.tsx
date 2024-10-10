import {
  useStakingBackendQueryWithParams,
  useStakingBackendSuspenseQuery,
} from '@/lib/sent-staking-backend-client';
import { getOpenNodes } from '@/lib/queries/getOpenNodes';
import { getStakedNodes } from '@/lib/queries/getStakedNodes';
import { getNodes } from '@/lib/queries/getNodes';
import { useMemo } from 'react';
import { areHexesEqual } from '@session/util-crypto/string';
import { getUnixTimestampNowSeconds } from '@session/util-js/date';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';

export const useRegisteredNode = ({ nodeId }: { nodeId?: string }) => {
  const { address } = useWallet();
  const { data: openData } = useStakingBackendSuspenseQuery(getOpenNodes);
  const { data: runningData } = useStakingBackendSuspenseQuery(getNodes);
  const { data: stakedData } = useStakingBackendQueryWithParams(
    getStakedNodes,
    {
      address: address!,
    },
    { enabled: !!address }
  );

  const openNode = useMemo(
    () => openData?.nodes?.find((node) => areHexesEqual(node.service_node_pubkey, nodeId)),
    [openData, nodeId]
  );
  const runningNode = useMemo(
    () => runningData?.nodes?.find((node) => areHexesEqual(node.service_node_pubkey, nodeId)),
    [runningData, nodeId]
  );
  const stakedNode = useMemo(
    () => stakedData?.stakes?.find((stake) => areHexesEqual(stake.service_node_pubkey, nodeId)),
    [stakedData, nodeId]
  );

  const networkTime = useMemo(
    () =>
      stakedData?.network.block_timestamp ??
      runningData?.network.block_timestamp ??
      getUnixTimestampNowSeconds(),
    [stakedData, runningData]
  );

  const blockHeight = useMemo(
    () => stakedData?.network?.block_height ?? runningData?.network.block_height ?? 0,
    [stakedData, runningData]
  );

  return {
    found: !!(openNode || stakedNode || runningNode),
    openNode,
    stakedNode,
    runningNode,
    networkTime,
    blockHeight,
  };
};
