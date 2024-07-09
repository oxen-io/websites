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
  hideBalance,
  ...props
}: WalletButtonProps) {
  const name = useMemo(
    () => collapseString(arbName ?? ensName ?? address ?? fallbackName, 6, 4),
    [ensName, arbName, address]
  );

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'group',
        'select-none justify-end overflow-x-hidden text-xs',
        isConnected
          ? 'bg-session-green hover:bg-session-green hover:text-session-black h-full w-full max-w-28 border-2 px-0 py-0 transition-all duration-1000 ease-in-out hover:brightness-110 motion-reduce:transition-none sm:max-w-36 lg:hover:max-w-full lg:focus:max-w-full lg:active:max-w-full'
          : 'px-3 py-2',
        forceBalanceOpen && 'lg:max-w-full'
      )}
      aria-label={isConnected ? ariaLabels.connected : ariaLabels.disconnected}
      data-testid={ButtonDataTestId.Wallet_Modal}
      {...props}
    >
      {isConnected ? (
        <>
          {!hideBalance ? (
            <div
              className={cn(
                'text-session-white -mr-4 inline-flex h-full w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-s-full py-2.5 pe-6 ps-3 text-xs md:text-sm',
                'group-hover:bg-session-black group-active:bg-session-black group-focus:bg-session-black transition-colors delay-1000 duration-0 ease-in-out group-hover:delay-0 group-focus:delay-0 group-active:delay-0 motion-reduce:transition-none',
                forceBalanceOpen && 'bg-session-black delay-0'
              )}
            >
              <SessionTokenIcon className="h-4 w-4" />
              {tokenBalance ? formatBigIntTokenValue(tokenBalance, SENT_DECIMALS) : 0} {SENT_SYMBOL}
            </div>
          ) : null}
          <div
            className={cn(
              'inline-flex h-full items-center justify-evenly gap-1 whitespace-nowrap px-2 py-2 text-xs md:text-sm',
              !hideBalance && 'bg-session-green w-full rounded-s-full sm:w-36 sm:min-w-36'
            )}
          >
            <ConnectedWalletAvatar className="h-5 w-5 sm:h-6 sm:w-6" avatarSrc={ensAvatar} />
            {name}
          </div>
        </>
      ) : (
        labels[status]
      )}
    </Button>
  );
}
