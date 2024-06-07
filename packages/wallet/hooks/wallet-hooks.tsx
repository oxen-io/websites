import { SENT_DECIMALS, SENT_SYMBOL, addresses } from '@session/contracts';
import { CHAIN, ChainId, chainIdMap, chains } from '@session/contracts/chains';
import { useEns } from '@session/contracts/hooks/ens';
import { useMemo, useState } from 'react';
import { createWalletClient, custom, type Address } from 'viem';
import { useAccount } from 'wagmi';
import { useArbName } from './arb';

/**
 * The status of a wallet.
 */
export enum WALLET_STATUS {
  /** The wallet is connecting. */
  CONNECTING = 'connecting',
  /** The wallet is reconnecting. */
  RECONNECTING = 'reconnecting',
  /** The wallet is connected. */
  CONNECTED = 'connected',
  /** The wallet is disconnected. */
  DISCONNECTED = 'disconnected',
}

/**
 * Parses the wallet connection status based on the provided flags.
 *
 * @returns The wallet connection status.
 */
const parseWalletStatus = ({
  isConnecting,
  isDisconnected,
  isConnected,
  isReconnecting,
}: {
  isConnecting: boolean;
  isDisconnected: boolean;
  isConnected: boolean;
  isReconnecting: boolean;
}): WALLET_STATUS => {
  if (isConnecting) return WALLET_STATUS.CONNECTING;
  if (isReconnecting) return WALLET_STATUS.RECONNECTING;
  if (isConnected) return WALLET_STATUS.CONNECTED;
  if (isDisconnected) return WALLET_STATUS.DISCONNECTED;
  return WALLET_STATUS.DISCONNECTED;
};

type UseWalletType = {
  /** The address of the wallet. */
  address?: Address;
  /** The ENS name of the wallet. */
  ensName?: string | null;
  /** The ENS avatar of the wallet. */
  ensAvatar?: string | null;
  /** The .arb name of the wallet. */
  arbName?: string | null;
  /** The status of the wallet. */
  status: WALLET_STATUS;
  /** Whether the wallet is connected. */
  isConnected: boolean;
};

export function useWallet(): UseWalletType {
  const { address, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount();
  const { ensName, ensAvatar } = useEns({
    address,
    enabled: isConnected,
  });

  const { arbName } = useArbName({ address });

  const status = useMemo(
    () => parseWalletStatus({ isConnected, isConnecting, isDisconnected, isReconnecting }),
    [isConnected, isConnecting, isDisconnected, isReconnecting]
  );

  return { address, ensName, ensAvatar, arbName, status, isConnected };
}

export function useWalletChain() {
  const { chainId } = useAccount();

  const chain = useMemo(() => {
    if (!chainId) return null;

    const validChain = chainIdMap[chainId as ChainId];
    if (!validChain) return null;

    return validChain;
  }, [chainId]);

  return { chain };
}

export function useAddToken() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { chain } = useWalletChain();

  const addToken = async () => {
    setIsPending(true);
    setIsSuccess(false);
    try {
      if (!chain || (chain !== CHAIN.MAINNET && chain !== CHAIN.TESTNET)) {
        throw new Error('Invalid chain');
      }

      const walletClient = createWalletClient({
        chain: chains[chain],
        transport: custom(window.ethereum!),
      });

      const wasAdded = await walletClient.watchAsset({
        type: 'ERC20',
        options: {
          // The address of the token.
          address: addresses.SENT[chain],
          // A ticker symbol or shorthand, up to 5 characters.
          symbol: SENT_SYMBOL.replaceAll('$', ''),
          // The number of decimals in the token.
          decimals: SENT_DECIMALS,
          // A string URL of the token logo.
          image: '/images/icon.png',
        },
      });

      if (!wasAdded) {
        throw new Error('Failed to add token');
      }

      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to add token');
      }
    } finally {
      setIsPending(false);
    }
  };
  return { addToken, error, isPending, isSuccess };
}
