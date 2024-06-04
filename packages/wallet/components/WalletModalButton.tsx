import { Button } from '@session/ui/components/ui/button';
import { collapseString } from '@session/util/string';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useMemo } from 'react';
import { WALLET_STATUS, useWallet } from '../hooks/wallet-hooks';
import { ButtonDataTestId } from '../testing/data-test-ids';
import { ConnectedWalletAvatar } from './WalletAvatar';

type WalletModalButtonProps = {
  labels: Record<WALLET_STATUS, string>;
  ariaLabels: {
    connected: string;
    disconnected: string;
  };
  fallbackName: string;
};

export default function WalletModalButton(props: WalletModalButtonProps) {
  const { address, ensName, arbName, status, isConnected } = useWallet();
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
      arbName={arbName}
    />
  );
}

type WalletButtonProps = WalletModalButtonProps &
  Omit<ReturnType<typeof useWallet>, 'isConnected'> & {
    handleClick: () => void;
    fallbackName: string;
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
  arbName,
  fallbackName,
}: WalletButtonProps) {
  const name = useMemo(
    () => collapseString(arbName ?? ensName ?? address ?? fallbackName, 6, 4),
    [ensName, arbName, address]
  );

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      data-testid={ButtonDataTestId.Wallet_Modal}
      className="gap-1 px-2 py-1"
      variant={isConnected ? 'outline' : 'default'}
      aria-label={isConnected ? ariaLabels.connected : ariaLabels.disconnected}
    >
      {isConnected ? (
        <>
          <ConnectedWalletAvatar className="h-4 w-4" avatarSrc={ensAvatar} />
          {name}
        </>
      ) : (
        labels[status]
      )}
    </Button>
  );
}
