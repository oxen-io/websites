import { testnet } from '@session/contracts';
import { isProduction } from '@session/util/env';
import { defaultWagmiConfig } from '@web3modal/wagmi';
import { mainnet } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

export type WagmiMetadata = Parameters<typeof defaultWagmiConfig>[0]['metadata'];
export type WagmiConfig = ReturnType<typeof defaultWagmiConfig>;

const chains = [isProduction() ? mainnet : testnet] as const;

/**
 * Creates a Wagmi configuration object.
 *
 * @param options The options for creating the Wagmi configuration.
 * @param options.projectId The project ID.
 * @param  options.metadata The metadata for the Wagmi configuration.
 * @returns The created Wagmi configuration.
 */
export const createWagmiConfig = ({
  projectId,
  metadata,
}: {
  projectId: string;
  metadata: WagmiMetadata;
}): WagmiConfig =>
  defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
