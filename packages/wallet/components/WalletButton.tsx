import { Button } from '@session/ui/components/ui/button';
import { EthIcon } from '@session/ui/icons/EthIcon';
import { cn } from '@session/ui/lib/utils';
import { collapseString } from '@session/util/string';
import { useMemo } from 'react';
import { ButtonDataTestId } from '../testing/data-test-ids';
import { ConnectedWalletAvatar } from './WalletAvatar';
import { WalletButtonProps } from './WalletModalButton';

export function WalletButton({
  labels,
  ariaLabels,
  handleClick,
  isConnected,
  isLoading,
  isModalOpen,
  status,
  address,
  ensAvatar,
  ensName,
  arbName,
  ethBalance,
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
      className={cn(
        'group',
        'h-full w-full max-w-36 select-none justify-end overflow-x-hidden transition-all duration-300 ease-in-out hover:max-w-full focus:max-w-full active:max-w-full motion-reduce:transition-none',
        isConnected
          ? 'bg-session-green hover:bg-session-green hover:text-session-black px-0 py-0 hover:brightness-110'
          : 'px-3 py-1',
        isModalOpen && 'max-w-full'
      )}
      aria-label={isConnected ? ariaLabels.connected : ariaLabels.disconnected}
    >
      {isConnected ? (
        <>
          <div
            className={cn(
              'text-session-white border-session-green bg-session-black -mr-4 inline-flex h-full w-full items-center justify-center whitespace-nowrap rounded-s-full border border-s-2 py-2 pe-5 ps-3'
            )}
          >
            <EthIcon className="h-5 w-5" />
            {ethBalance} ETH
          </div>
          <div
            className={cn(
              'border-session-green bg-session-green inline-flex h-full w-36 items-center justify-center gap-1 whitespace-nowrap rounded-full rounded-s-full border px-3 py-2'
            )}
          >
            <ConnectedWalletAvatar className="h-6 w-6" avatarSrc={ensAvatar} />
            {name}
          </div>
        </>
      ) : (
        labels[status]
      )}
    </Button>
  );
}
