import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { WALLET_STATUS, useWallet } from '../hooks/wallet-hooks';
import { WalletButton } from './WalletButton';

type WalletModalButtonProps = {
  labels: Record<WALLET_STATUS, string>;
  ariaLabels: {
    connected: string;
    disconnected: string;
  };
  fallbackName: string;
};

export default function WalletModalButton(props: WalletModalButtonProps) {
  const { address, ensName, arbName, ethBalance, status, isConnected } = useWallet();
  const { open } = useWeb3Modal();
  const { open: isOpen } = useWeb3ModalState();

  const isLoading = status === WALLET_STATUS.CONNECTING || status === WALLET_STATUS.RECONNECTING;

  const handleClick = () => {
    if (isLoading) return;
    open({ view: isConnected ? 'Account' : 'Connect' });
  };

  return (
    <WalletButton
      {...props}
      handleClick={handleClick}
      isConnected={isConnected}
      isLoading={isLoading}
      isModalOpen={isOpen}
      status={status}
      address={address}
      ensName={ensName}
      arbName={arbName}
      ethBalance={ethBalance}
    />
  );
}

export type WalletButtonProps = WalletModalButtonProps &
  Omit<ReturnType<typeof useWallet>, 'isConnected'> & {
    handleClick: () => void;
    fallbackName: string;
    isLoading?: boolean;
    isConnected?: boolean;
    isModalOpen?: boolean;
  };
