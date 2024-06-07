import { CHAIN, isChain } from '@session/contracts/chains';
import { Button, type ButtonVariantProps } from '@session/ui/components/ui/button';
import { GlobeIcon } from '@session/ui/icons/GlobeIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@session/ui/ui/dropdown-menu';
import { useMemo } from 'react';
import { useWalletChain } from '../hooks/wallet-hooks';
import { ButtonDataTestId } from '../testing/data-test-ids';

export type WalletNetworkButtonProps = ButtonVariantProps & {
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

export default function WalletNetworkDropdown(props: WalletNetworkButtonProps) {
  const { chain, switchChain } = useWalletChain();

  const handleValueChange = (selectedChain: string) => {
    if (selectedChain === chain) {
      return;
    }

    if (!isChain(selectedChain)) {
      return;
    }

    switchChain(selectedChain);
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
}: NetworkButtonProps) {
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
          {chain === null ? null : (
            <GlobeIcon className="fill-session-green group-hover:fill-session-black mr-1 h-4 w-4" />
          )}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose a Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
