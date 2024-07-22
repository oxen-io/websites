import { CHAIN, isChain } from '@session/contracts/chains';
import { Button, type ButtonVariantProps } from '@session/ui/components/ui/button';
import { ArbitrumIcon } from '@session/ui/icons/ArbitrumIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@session/ui/ui/dropdown-menu';
import { useMemo } from 'react';
import { useWalletChain } from '../hooks/wallet-hooks';
import { ButtonDataTestId } from '../testing/data-test-ids';
import { SwitchChainErrorType } from 'viem';

export type WalletNetworkButtonProps = ButtonVariantProps & {
  className?: string;
  handleError: (error: SwitchChainErrorType) => void;
  labels: {
    mainnet: string;
    testnet: string;
    invalid: string;
  };
  ariaLabels: {
    mainnet: string;
    testnet: string;
    dropdown: string;
  };
};

export default function WalletNetworkDropdown({ handleError, ...props }: WalletNetworkButtonProps) {
  const { chain, switchChain } = useWalletChain();

  const handleValueChange = async (selectedChain: string) => {
    if (selectedChain === chain) {
      return;
    }

    if (!isChain(selectedChain)) {
      return;
    }

    await switchChain(selectedChain, handleError);
  };

  return <NetworkDropdown {...props} handleValueChange={handleValueChange} chain={chain} />;
}

type NetworkButtonProps = WalletNetworkButtonProps & {
  handleValueChange: (selectedChain: string) => void;
  chain: CHAIN | null;
};

export function NetworkDropdown({
  labels,
  ariaLabels,
  handleValueChange,
  chain,
  ...props
}: Omit<NetworkButtonProps, 'handleError'>) {
  const label = useMemo(() => {
    if (chain === null) {
      return labels.invalid;
    }

    return chain === CHAIN.TESTNET ? labels.testnet : labels.mainnet;
  }, [chain, labels]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid={ButtonDataTestId.Change_Network_Dropdown}
          className="group gap-1 px-2 py-1"
          aria-label={ariaLabels.dropdown}
          {...props}
        >
          {chain === null ? null : <ArbitrumIcon className="mr-1 h-4 w-4" />}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        <DropdownMenuLabel>Choose a Network</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={chain ?? undefined} onValueChange={handleValueChange}>
          <DropdownMenuRadioItem value={CHAIN.MAINNET} aria-label={ariaLabels.mainnet}>
            {labels.mainnet}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={CHAIN.TESTNET} aria-label={ariaLabels.testnet}>
            {labels.testnet}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
