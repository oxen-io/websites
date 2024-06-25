import { CHAIN, chains } from '@session/contracts';
import { Address, createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export function createServerWallet(privateKey: Address, chain: CHAIN) {
  if (!privateKey) {
    throw new Error('Private key is required to create a server wallet');
  }

  const account = privateKeyToAccount(privateKey);

  return createWalletClient({
    account,
    chain: chains[chain],
    transport: http(),
  });
}

export function createPublicWalletClient(chain: CHAIN) {
  return createPublicClient({
    chain: chains[chain],
    transport: http(),
  });
}
