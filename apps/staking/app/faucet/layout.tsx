import { siteMetadata } from '@/lib/metadata';
import { ReactNode } from 'react';

export async function generateMetadata() {
  return siteMetadata({
    title: 'Faucet',
    description: 'Claim test SENT to participate in the Session Testnet Incentive Program.',
  });
}

export default async function FaucetLayout({ children }: { children: ReactNode }) {
  return children;
}
