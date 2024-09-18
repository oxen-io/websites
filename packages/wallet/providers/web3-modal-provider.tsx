'use client';

import { type ReactNode, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { type State, WagmiProvider as WagmiProviderCore } from 'wagmi';
import { createWagmiConfig, type WagmiMetadata } from '../lib/wagmi';

import { addresses } from '@session/contracts';
import { mainnet, testnet } from '@session/contracts/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';

/**
 * The wallet connect wallet address IDs.
 * @see https://explorer.walletconnect.com/
 */
enum Wallet {
  MetaMask = 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  Ledger = '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
  Rainbow = '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
  Phantom = 'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
  WalletConnect = 'e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b',
}

export const initWeb3Modal = ({
  projectId,
  wagmiMetadata,
}: {
  projectId: string;
  wagmiMetadata: WagmiMetadata;
}) => {
  const wagmiConfig = createWagmiConfig({
    projectId,
    metadata: wagmiMetadata,
  });

  createWeb3Modal({
    wagmiConfig,
    defaultChain: wagmiConfig.chains[0],
    allowUnsupportedChain: false,
    tokens: {
      [mainnet.id]: {
        address: addresses.SENT.mainnet,
        image: '/images/icon.png',
      },
      [testnet.id]: {
        address: addresses.SENT.testnet,
        image: '/images/icon.png',
      },
    },
    chainImages: {
      [mainnet.id]: '/images/arbitrum.svg',
      [testnet.id]: '/images/arbitrum.svg',
    },
    projectId,
    enableAnalytics: false,
    enableOnramp: false,
    featuredWalletIds: [
      Wallet.MetaMask,
      Wallet.Ledger,
      Wallet.Rainbow,
      Wallet.Phantom,
      Wallet.WalletConnect,
    ],
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': 'var(--session-green)',
    },
  });

  return wagmiConfig;
};

const queryClient = new QueryClient();

export type Web3ModalProviderProps = {
  children: ReactNode;
  initialState?: State;
  projectId: string;
  wagmiMetadata: WagmiMetadata;
};

export function Web3ModalProvider({
  children,
  initialState,
  projectId,
  wagmiMetadata,
}: Web3ModalProviderProps) {
  const [wagmiConfig] = useState(
    initWeb3Modal({
      projectId,
      wagmiMetadata,
    })
  );
  return (
    <WagmiProviderCore config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderCore>
  );
}
