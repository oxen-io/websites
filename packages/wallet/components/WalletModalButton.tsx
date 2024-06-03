import { Button } from '@session/ui/components/ui/button';
import { collapseString } from '@session/util/string';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { WALLET_STATUS, useWallet } from '../hooks/wallet-hooks';
import { ButtonDataTestId } from '../testing/data-test-ids';
import { ConnectedWalletAvatar } from './WalletAvatar';

type WalletModalButtonProps = {
  labels: Record<WALLET_STATUS, string>;
  ariaLabels: {
    connected: string;
    disconnected: string;
  };
};

export default function WalletModalButton(props: WalletModalButtonProps) {
  const { address, ensName, status, isConnected } = useWallet();
  const { open } = useWeb3Modal();

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
      status={status}
      address={address}
      ensName={ensName}
    />
  );
}

type WalletButtonProps = WalletModalButtonProps &
  Omit<ReturnType<typeof useWallet>, 'isConnected'> & {
    handleClick: () => void;
    isLoading?: boolean;
    isConnected?: boolean;
  };

export function WalletButton({
  labels,
  ariaLabels,
  handleClick,
  isConnected,
  isLoading,
  status,
  address,
  ensAvatar,
  ensName,
}: WalletButtonProps) {
  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      data-testid={ButtonDataTestId.Connect_Wallet}
      className="px-2 py-1 gap-1"
      variant={isConnected ? 'outline' : 'default'}
      aria-label={isConnected ? ariaLabels.connected : ariaLabels.disconnected}
    >
      {isConnected && address ? (
        <>
          <ConnectedWalletAvatar className="w-4 h-4" avatarSrc={ensAvatar} />
          {ensName ? collapseString(ensName, 4) : address ? collapseString(address, 4) : 'Error'}
        </>
      ) : (
        labels[status]
      )}
    </Button>
  );
}
