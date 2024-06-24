import { SENT_SYMBOL } from '@session/contracts';
import type { ReactNode } from 'react';

export const defaultTranslationValues = {
  medium: (chunks: ReactNode) => <span className="font-medium">{chunks}</span>,
  semibold: (chunks: ReactNode) => <span className="font-semibold">{chunks}</span>,
  tokenSymbol: SENT_SYMBOL,
};
