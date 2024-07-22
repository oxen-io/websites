import WalletAddTokenButton, {
  WalletAddTokenButtonProps,
} from '@session/wallet/components/WalletAddTokenButton';
import { useTranslations } from 'next-intl';

export function WalletAddTokenWithLocales(
  props: Omit<WalletAddTokenButtonProps, 'labels' | 'ariaLabels' | 'errors'>
) {
  const dictionary = useTranslations('wallet.watchTokenButton');
  return (
    <WalletAddTokenButton
      labels={{
        addToken: dictionary('importText'),
        changeNetwork: dictionary('changeNetwork'),
        pending: dictionary('pending'),
      }}
      ariaLabels={{
        addToken: dictionary('ariaImport'),
        changeNetwork: dictionary('ariaChangeNetwork'),
        pending: dictionary('ariaPending'),
      }}
      errors={{ fail: dictionary('failError') }}
      {...props}
    />
  );
}
