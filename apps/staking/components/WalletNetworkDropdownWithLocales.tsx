'use client';

import { NETWORK } from '@/lib/constants';
import WalletNetworkDropdown from '@session/wallet/components/WalletNetworkDropdown';
import { useTranslations } from 'next-intl';
import { useWallet } from '@session/wallet/hooks/wallet-hooks';
import { SwitchChainErrorType } from 'viem';
import { toast } from '@session/ui/lib/sonner';

export function WalletNetworkDropdownWithLocales({ className }: { className?: string }) {
  const { isConnected } = useWallet();
  const dictionary = useTranslations('wallet.networkDropdown');

  // TODO - handle specific errors
  const handleError = (error: SwitchChainErrorType) => {
    toast.error(dictionary('errorNotSupported'));
  };

  return isConnected ? (
    <WalletNetworkDropdown
      handleError={handleError}
      className={className}
      labels={{
        mainnet: NETWORK.MAINNET,
        testnet: NETWORK.TESTNET,
        invalid: dictionary('invalid'),
      }}
      ariaLabels={{
        mainnet: dictionary('ariaMainnet'),
        testnet: dictionary('ariaTestnet'),
        dropdown: dictionary('ariaDropdown'),
      }}
      variant="outline"
    />
  ) : null;
}
