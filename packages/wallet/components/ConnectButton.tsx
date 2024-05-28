import { Button } from '@session/ui/components/ui/button';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ButtonDataTestId } from '../testing/data-test-ids';

interface ConnectButtonProps {
  labels: {
    disconnected: string;
    connected: string;
    connecting: string;
    reconnecting: string;
  };
}

export default function ConnectButton({ labels }: ConnectButtonProps) {
  const { open } = useWeb3Modal();
  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } = useAccount();

  const buttonText = useMemo(() => {
    if (isConnecting) {
      return labels.connecting;
    }
    if (isReconnecting) {
      return labels.reconnecting;
    }
    if (isConnected && address) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    if (isDisconnected) {
      return labels.disconnected;
    }
    return labels.disconnected;
  }, [isConnecting, isReconnecting, isConnected, address, isDisconnected]);

  const handleClick = () => {
    if (isConnecting) return;
    open({
      view: isDisconnected ? 'Connect' : 'Account',
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isConnecting}
      data-testid={ButtonDataTestId.Connect_Wallet}
    >
      {buttonText}
    </Button>
  );
}
