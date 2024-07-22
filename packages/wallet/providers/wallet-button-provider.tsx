'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

type WalletButtonContext = {
  isBalanceVisible: boolean;
  setIsBalanceVisible: (isVisible: boolean) => void;
};

const Context = createContext<WalletButtonContext | undefined>(undefined);

export function WalletButtonProvider({ children }: { children: ReactNode }) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  return (
    <Context.Provider value={{ isBalanceVisible, setIsBalanceVisible }}>
      {children}
    </Context.Provider>
  );
}

export const useWalletButton = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useWalletButton must be used inside WalletButtonProvider');
  }

  return context;
};
