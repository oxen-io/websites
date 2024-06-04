import { useMemo } from 'react';
import type { Address } from 'viem';
import { normalize } from 'viem/ens';
import { useConfig, useEnsAvatar, useEnsName } from 'wagmi';
import { ethereum } from '../chains';

type UseEnsType = {
  /** The ENS name of the wallet. */
  ensName?: string | null;
  /** The ENS avatar of the wallet. */
  ensAvatar?: string | null;
};

export function useEns({ address, enabled }: { address?: Address; enabled: boolean }): UseEnsType {
  const wagmiConfig = useConfig();

  const ensConfig = useMemo(() => {
    return {
      config: {
        ...wagmiConfig,
        chains: [ethereum] as const,
      },
      chainId: ethereum.id,
      universalResolverAddress: ethereum.contracts.ensUniversalResolver.address,
    };
  }, [wagmiConfig]);

  const { data: ensName } = useEnsName({
    query: { enabled },
    address,
    ...ensConfig,
  });

  const normalizedEnsName = useMemo(() => (ensName ? normalize(ensName) : undefined), [ensName]);

  const { data: ensAvatar } = useEnsAvatar({
    query: { enabled: !!normalizedEnsName },
    name: normalizedEnsName,
    ...ensConfig,
  });

  return { ensName, ensAvatar };
}
