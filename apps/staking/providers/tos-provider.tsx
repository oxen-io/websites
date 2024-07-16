'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

type TOSContext = {
  acceptedTOS: boolean;
  setAcceptedTOS: (accepted: boolean) => void;
};

const localStorageTOSKey = 'tosAccepted';

function saveAcceptedTOSToStorage(accepted: boolean) {
  localStorage.setItem(localStorageTOSKey, `${accepted}`);

  // @ts-expect-error - Expose TOS to window for debugging
  window.acceptedTOS = accepted;
}

function loadAcceptedTOSFromStorage() {
  if (typeof window === 'undefined') {
    return false;
  }

  const storedTOS = localStorage.getItem(localStorageTOSKey);

  return storedTOS ? Boolean(storedTOS) : false;
}

const Context = createContext<TOSContext | undefined>(undefined);

export default function TOSProvider({ children }: { children: ReactNode }) {
  const [acceptedTOS, setAcceptedTOS] = useState<boolean>(loadAcceptedTOSFromStorage());

  return <Context.Provider value={{ acceptedTOS, setAcceptedTOS }}>{children}</Context.Provider>;
}

export const useTOS = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useTOS must be used inside TOSProvider');
  }

  return context.acceptedTOS;
};

export const useSetTOS = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('setTOS must be used inside TOSProvider');
  }

  const acceptTOS = (accepted: boolean) => {
    context.setAcceptedTOS(accepted);
    saveAcceptedTOSToStorage(accepted);
  };

  return { acceptTOS };
};
