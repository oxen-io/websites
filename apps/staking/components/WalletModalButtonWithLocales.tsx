import WalletModalButton from '@session/wallet/components/WalletModalButton';
import { useTranslations } from 'next-intl';

export function WalletModalButtonWithLocales() {
  const dictionary = useTranslations('wallet.modalButton');
  return (
    <WalletModalButton
      labels={{
        disconnected: dictionary('connect'),
        connected: dictionary('connected'),
        connecting: dictionary('connecting'),
        reconnecting: dictionary('reconnecting'),
      }}
      ariaLabels={{
        connected: dictionary('ariaConnected'),
        disconnected: dictionary('ariaDisconnected'),
      }}
      fallbackName={dictionary('fallbackName')}
    />
  );
}
