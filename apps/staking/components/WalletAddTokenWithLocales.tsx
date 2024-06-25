import { SENT_SYMBOL } from '@session/contracts';
import WalletAddTokenButton, {
  WalletAddTokenButtonProps,
} from '@session/wallet/components/WalletAddTokenButton';
import { useTranslations } from 'next-intl';

export function WalletAddTokenWithLocales(
  props: Omit<WalletAddTokenButtonProps, 'labels' | 'ariaLabels'>
) {
  const dictionary = useTranslations('wallet.addTokenButton');
  return (
    <WalletAddTokenButton
      labels={{
        addToken: dictionary('addToken', { tokenSymbol: SENT_SYMBOL }),
        changeNetwork: dictionary('changeNetwork'),
        pending: dictionary('pending'),
      }}
      ariaLabels={{
        addToken: dictionary('ariaAddToken', { tokenSymbol: SENT_SYMBOL }),
        changeNetwork: dictionary('ariaChangeNetwork'),
        pending: dictionary('ariaPending'),
      }}
      {...props}
    />
  );
}
