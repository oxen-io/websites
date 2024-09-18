'use client';

import WalletModalButton, {
  WalletModalButtonProps,
} from '@session/wallet/components/WalletModalButton';
import { useTranslations } from 'next-intl';

export function WalletModalButtonWithLocales({
  labels,
  ariaLabels,
  fallbackName,
  ...props
}: Partial<WalletModalButtonProps>) {
  const dictionary = useTranslations('wallet.modalButton');
  return (
    <WalletModalButton
      labels={
        labels ?? {
          disconnected: dictionary('connect'),
          connected: dictionary('connected'),
          connecting: dictionary('connecting'),
          reconnecting: dictionary('connecting'),
        }
      }
      ariaLabels={
        ariaLabels ?? {
          connected: dictionary('ariaConnected'),
          disconnected: dictionary('ariaDisconnected'),
        }
      }
      fallbackName={fallbackName ?? dictionary('fallbackName')}
      {...props}
    />
  );
}
