import { SENT_DECIMALS, SENT_SYMBOL } from '@session/contracts';
import { Button } from '@session/ui/components/ui/button';
import { SessionTokenIcon } from '@session/ui/icons/SessionTokenIcon';
import { cn } from '@session/ui/lib/utils';
import { formatBigIntTokenValue } from '@session/util/maths';
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
  forceBalanceOpen,
  status,
  address,
  ensAvatar,
  ensName,
  arbName,
  tokenBalance,
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
        'h-full w-full max-w-36 select-none justify-end overflow-x-hidden transition-all duration-1000 ease-in-out motion-reduce:transition-none lg:hover:max-w-full lg:focus:max-w-full lg:active:max-w-full',
        isConnected
          ? 'bg-session-green hover:bg-session-green hover:text-session-black border-2 px-0 py-0 hover:brightness-110'
          : 'px-3 py-2',
        forceBalanceOpen && 'lg:max-w-full'
      )}
      aria-label={isConnected ? ariaLabels.connected : ariaLabels.disconnected}
    >
      {isConnected ? (
        <>
          <div
            className={cn(
              'text-session-white -mr-4 inline-flex h-full w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-s-full py-2.5 pe-6 ps-3',
              'group-hover:bg-session-black group-active:bg-session-black group-focus:bg-session-black transition-colors delay-1000 duration-0 ease-in-out group-hover:delay-0 group-focus:delay-0 group-active:delay-0 motion-reduce:transition-none',
              forceBalanceOpen && 'bg-session-black delay-0'
            )}
          >
            <SessionTokenIcon className="h-4 w-4" />
            {tokenBalance ? formatBigIntTokenValue(tokenBalance, SENT_DECIMALS) : 0} {SENT_SYMBOL}
          </div>
          <div
            className={cn(
              'bg-session-green inline-flex h-full w-36 min-w-36 items-center justify-evenly gap-1 whitespace-nowrap rounded-s-full px-2 py-2'
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
