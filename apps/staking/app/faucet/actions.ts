'use server';
import { FAUCET, TICKER } from '@/lib/constants';
import { CHAIN, SENT_SYMBOL, addresses, formatSENT, parseSENT } from '@session/contracts';
import { SENTAbi } from '@session/contracts/abis';
import { createPublicWalletClient, createServerWallet } from '@session/wallet/lib/server-wallet';
import { formatEther, isAddress as isAddressViem, type Address } from 'viem';

const faucetGasWarning = 0.01;
const faucetSENTWarning = 20000;

const isAddress = (address?: string): address is Address => {
  return !!address && isAddressViem(address, { strict: false });
};

const isPrivateKey = (key?: string): key is Address => {
  return !!key && key.startsWith('0x');
};

export async function getEthBalance({ address, chain }: { address?: Address; chain: CHAIN }) {
  if (!isAddress(address)) {
    throw new Error('Address is required');
  }

  const client = createPublicWalletClient(chain);

  const balance = await client.getBalance({
    address,
  });

  return formatEther(balance);
}

export async function getSENTBalance({ address, chain }: { address?: Address; chain: CHAIN }) {
  if (!isAddress(address)) {
    throw new Error('Address is required');
  }

  const client = createPublicWalletClient(chain);

  if (chain !== CHAIN.TESTNET && chain !== CHAIN.MAINNET) {
    throw new Error('Invalid chain');
  }

  const balance = await client.readContract({
    address: addresses.SENT[chain],
    abi: SENTAbi,
    functionName: 'balanceOf',
    args: [address],
  });

  return formatSENT(balance);
}

export async function sentTestSent({ address, chain }: { address?: Address; chain: CHAIN }) {
  try {
    const privateKey = process.env.FAUCET_WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Faucet wallet private key is required');
    }

    if (!isPrivateKey(privateKey)) {
      throw new Error('Invalid faucet wallet private key');
    }

    if (!isAddress(address)) {
      throw new Error('Address is required');
    }

    if (chain !== CHAIN.TESTNET) {
      throw new Error('Faucet only works on testnet');
    }

    const serverWallet = createServerWallet(privateKey, chain);

    const walletAddress = (await serverWallet.getAddresses())[0];
    const targetEthBalancePromise = getEthBalance({ address, chain });
    const faucetEthBalancePromise = getEthBalance({ address: walletAddress, chain });
    const faucetSENTBalancePromise = getSENTBalance({ address: walletAddress, chain });

    const [targetEthBalance, faucetEthBalance, faucetSENTBalance] = await Promise.all([
      targetEthBalancePromise,
      faucetEthBalancePromise,
      faucetSENTBalancePromise,
    ]);

    if (parseFloat(targetEthBalance) < FAUCET.MIN_ETH_BALANCE) {
      throw new Error(
        `Insufficient ${TICKER.ETH} balance (${targetEthBalance} ${TICKER.ETH}): faucet requires at least ${FAUCET.MIN_ETH_BALANCE.toLocaleString()} ${TICKER.ETH}`
      );
    }

    if (parseFloat(faucetSENTBalance) < FAUCET.DRIP) {
      throw new Error(
        `Insufficient ${SENT_SYMBOL} balance: faucet requires at least ${FAUCET.DRIP}. Please contact support`
      );
    }

    if (parseFloat(faucetEthBalance) < faucetGasWarning) {
      console.warn(
        `Faucet wallet ${TICKER.ETH} balance (${faucetEthBalance} ${TICKER.ETH}) if below the warning threshold (${faucetGasWarning})`
      );
    }

    if (parseFloat(faucetSENTBalance) < faucetSENTWarning) {
      console.warn(
        `Faucet wallet ${SENT_SYMBOL} balance (${faucetSENTBalance} ${SENT_SYMBOL}) if below the warning threshold (${faucetSENTWarning})`
      );
    }

    const hash = await serverWallet.writeContract({
      address: addresses.SENT[chain],
      abi: SENTAbi,
      functionName: 'transfer',
      args: [address, parseSENT(FAUCET.DRIP.toLocaleString())],
    });

    return { hash };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'An unknown error occurred' };
    }
  }
}
