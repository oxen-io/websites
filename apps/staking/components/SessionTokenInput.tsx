'use client';

import { Input, InputProps } from '@session/ui/ui/input';
import { useWalletButton } from '@session/wallet/providers/wallet-button-provider';
import { forwardRef } from 'react';

export const SessionTokenInput = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
  const { setIsBalanceVisible } = useWalletButton();

  const handleFocus = () => {
    setIsBalanceVisible(true);
  };

  const handleBlur = () => {
    setIsBalanceVisible(false);
  };

  return <Input ref={ref} {...props} onFocus={handleFocus} onBlur={handleBlur} />;
});
SessionTokenInput.displayName = 'SessionTokenInput';
