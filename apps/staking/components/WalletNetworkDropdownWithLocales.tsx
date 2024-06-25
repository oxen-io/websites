import WalletNetworkDropdown from '@session/wallet/components/WalletNetworkDropdown';
import { useTranslations } from 'next-intl';

export function WalletNetworkDropdownWithLocales({ className }: { className?: string }) {
  const dictionary = useTranslations('wallet.networkDropdown');
  return (
    <WalletNetworkDropdown
      className={className}
      labels={{
        mainnet: dictionary('mainnet'),
        testnet: dictionary('testnet'),
        invalid: dictionary('invalid'),
      }}
      ariaLabels={{
        mainnet: dictionary('ariaMainnet'),
        testnet: dictionary('ariaTestnet'),
        dropdown: dictionary('ariaDropdown'),
      }}
      variant="outline"
    />
  );
}
