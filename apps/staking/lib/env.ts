import { isProduction as isProductionEnv } from '@session/util-js/env';

export const NEXT_PUBLIC_SENT_STAKING_API_URL = process.env.NEXT_PUBLIC_SENT_STAKING_API_URL!;
if (!NEXT_PUBLIC_SENT_STAKING_API_URL) {
  throw new Error('NEXT_PUBLIC_SENT_STAKING_API_URL is required');
}

export const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;
if (!NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is required');
}

export const isProduction = isProductionEnv();
