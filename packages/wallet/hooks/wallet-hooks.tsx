import { useEns } from '@session/contracts/hooks/ens';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

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

  const status = useMemo(
    () => parseWalletStatus({ isConnected, isConnecting, isDisconnected, isReconnecting }),
    [isConnected, isConnecting, isDisconnected, isReconnecting]
  );

  return { address, ensName, ensAvatar, status, isConnected };
}
