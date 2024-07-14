'use server';

import { COMMUNITY_DATE, FAUCET, FAUCET_ERROR, TICKER } from '@/lib/constants';
import {
  addresses,
  CHAIN,
  formatSENT,
  isChain,
  SENT_DECIMALS,
  SENT_SYMBOL,
} from '@session/contracts';
import { SENTAbi } from '@session/contracts/abis';
import { isProduction } from '@/lib/env';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { createPublicWalletClient, createServerWallet } from '@session/wallet/lib/server-wallet';
import * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import { getLocale, getTranslations } from 'next-intl/server';
import { formatEther, isAddress as isAddressViem, type Address } from 'viem';
import { FaucetFormSchema } from './AuthModule';
import {
  TABLE,
  TransactionHistory,
  getTransactionHistory,
  hasRecentTransaction,
  idIsInTable,
  openDatabase,
  setupDatababse,
} from './utils';

class FaucetError extends Error {
  faucetError: FAUCET_ERROR;
  history?: Array<TransactionHistory>;

  constructor(faucetError: FAUCET_ERROR, message: string, history?: Array<TransactionHistory>) {
    super(message);
    this.name = 'FaucetError';
    this.faucetError = faucetError;
    this.history = history;
  }
}

class FaucetResult {
  hash?: Address;
  tokenAmount?: string;
  ethTopupHash?: Address;
  ethTopupAmount?: string;
  error?: string;
  faucetError?: FAUCET_ERROR;
  history?: Array<TransactionHistory>;

  constructor({
    hash,
    tokenAmount,
    ethTopupHash,
    ethTopupAmount,
    error,
    faucetError,
    history,
  }: {
    hash?: Address;
    tokenAmount?: string;
    ethTopupHash?: Address;
    ethTopupAmount?: string;
    error?: string;
    faucetError?: FAUCET_ERROR;
    history?: Array<TransactionHistory>;
  }) {
    this.hash = hash;
    this.tokenAmount = tokenAmount;
    this.ethTopupHash = ethTopupHash;
    this.ethTopupAmount = ethTopupAmount;
    this.error = error;
    this.faucetError = faucetError;
    this.history = history;
  }
}

const faucetTokenWarning = BigInt(20000 * Math.pow(10, SENT_DECIMALS));
const faucetGasWarning = BigInt(0.01 * Math.pow(10, ETH_DECIMALS));
const faucetTokenDrip = BigInt(FAUCET.DRIP * Math.pow(10, SENT_DECIMALS));

const minTargetEthBalance = BigInt(FAUCET.MIN_ETH_BALANCE * Math.pow(10, ETH_DECIMALS));

const hoursBetweenTransactions = parseInt(process.env.FAUCET_HOURS_BETWEEN_USES ?? '0');

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

  return balance;
}

export async function getSessionTokenBalance({
  address,
  chain,
}: {
  address?: Address;
  chain: CHAIN;
}) {
  if (!isAddress(address)) {
    throw new Error('Address is required');
  }

  const client = createPublicWalletClient(chain);

  // TODO: Change this to be a list of all valid session token chains
  if (chain !== CHAIN.TESTNET && chain !== CHAIN.MAINNET) {
    throw new Error('Invalid chain');
  }

  const balance = await client.readContract({
    address: addresses.SENT[chain],
    abi: SENTAbi,
    functionName: 'balanceOf',
    args: [address],
  });

  return balance;
}

setupDatababse();

export async function transferTestTokens({
  walletAddress: targetAddress,
  discordId,
  telegramId,
}: FaucetFormSchema) {
  const dictionary = await getTranslations('faucet.form.error');
  const locale = await getLocale();

  let result: FaucetResult = new FaucetResult({});
  let db: BetterSql3.Database | undefined;

  try {
    if (!isAddress(targetAddress)) {
      throw new FaucetError(
        FAUCET_ERROR.INVALID_ADDRESS,
        dictionary('invalidAddress', { example: '0x...' })
      );
    }

    /**
     * NOTE: This enforces a set chain but its locked to {@see CHAIN.TESTNET} for now this should be changed to allow for multiple chains.
     */
    const chain = process.env.FAUCET_CHAIN;
    if (!chain || !isChain(chain) || chain !== CHAIN.TESTNET) {
      throw new FaucetError(FAUCET_ERROR.INCORRECT_CHAIN, dictionary('incorrectChain'));
    }

    const { faucetAddress, faucetWallet } = await connectFaucetWallet();

    const [targetEthBalance, faucetEthBalance, faucetTokenBalance] = await Promise.all([
      getEthBalance({ address: targetAddress, chain }),
      getEthBalance({ address: faucetAddress, chain }),
      getSessionTokenBalance({ address: faucetAddress, chain }),
    ]);

    /**
     * If the faucet wallet has less than the required token balance, the transaction will fail.
     */
    if (faucetTokenBalance < faucetTokenDrip) {
      throw new FaucetError(
        FAUCET_ERROR.FAUCET_OUT_OF_TOKENS,
        dictionary('faucetOutOfTokensTextOnly')
      );
    }

    /**
     * If the faucet wallet has less than the warning ETH balance, a warning will be logged.
     */
    if (faucetEthBalance < faucetGasWarning) {
      console.warn(
        `Faucet wallet ${TICKER.ETH} balance (${formatEther(faucetEthBalance)} ${TICKER.ETH}) is below the warning threshold (${formatEther(faucetGasWarning)})`
      );
    }

    /**
     * If the faucet wallet has less than the warning token balance, a warning will be logged.
     */
    if (faucetTokenBalance < faucetTokenWarning) {
      console.warn(
        `Faucet wallet ${SENT_SYMBOL} balance (${formatSENT(faucetTokenBalance)} ${SENT_SYMBOL}) is below the warning threshold (${formatSENT(faucetTokenWarning)})`
      );
    }

    db = openDatabase();

    let usedOperatorAddress = false;

    /**
     * If the user has not provided a Discord or Telegram ID, they must be an operator.
     */
    if (!discordId && !telegramId) {
      if (
        !idIsInTable({
          db,
          source: TABLE.OPERATOR,
          id: targetAddress,
        })
      ) {
        throw new FaucetError(
          FAUCET_ERROR.INVALID_OXEN_ADDRESS,
          dictionary('invalidOxenAddress', {
            oxenRegistrationDate: new Intl.DateTimeFormat(locale, {
              dateStyle: 'long',
            }).format(new Date(COMMUNITY_DATE.OXEN_SERVICE_NODE_BONUS_PROGRAM)),
          })
        );
      }

      if (
        hasRecentTransaction({
          db,
          source: TABLE.OPERATOR,
          id: targetAddress,
          hoursBetweenTransactions,
        })
      ) {
        const transactionHistory = getTransactionHistory({ db, address: targetAddress });
        throw new FaucetError(
          FAUCET_ERROR.ALREADY_USED,
          dictionary('alreadyUsed'),
          transactionHistory
        );
      }

      usedOperatorAddress = true;

      /**
       * If the user has provided a Discord ID they must be in the approved list of Discord IDs and not have used the faucet recently.
       */
    } else if (discordId) {
      if (
        !idIsInTable({
          db,
          source: TABLE.DISCORD,
          id: discordId,
        })
      ) {
        throw new FaucetError(
          FAUCET_ERROR.INVALID_SERVICE,
          dictionary('invalidService', {
            service: 'Discord',
            snapshotDate: new Intl.DateTimeFormat(locale, {
              dateStyle: 'long',
            }).format(new Date(COMMUNITY_DATE.SESSION_TOKEN_COMMUNITY_SNAPSHOT)),
          })
        );
      }

      if (
        hasRecentTransaction({ db, source: TABLE.DISCORD, id: discordId, hoursBetweenTransactions })
      ) {
        throw new FaucetError(
          FAUCET_ERROR.ALREADY_USED_SERVICE,
          dictionary('alreadyUsedService', {
            service: 'Discord',
          })
        );
      }

      /**
       * If the user has provided a Telegram ID they must be in the approved list of Telegram IDs and not have used the faucet recently.
       */
    } else if (telegramId) {
      if (
        !idIsInTable({
          db,
          source: TABLE.TELEGRAM,
          id: telegramId,
        })
      ) {
        throw new FaucetError(
          FAUCET_ERROR.INVALID_SERVICE,
          dictionary('invalidService', {
            service: 'Telegram',
            snapshotDate: new Intl.DateTimeFormat(locale, {
              dateStyle: 'long',
            }).format(new Date(COMMUNITY_DATE.SESSION_TOKEN_COMMUNITY_SNAPSHOT)),
          })
        );
      }

      if (
        hasRecentTransaction({
          db,
          source: TABLE.TELEGRAM,
          id: telegramId,
          hoursBetweenTransactions,
        })
      ) {
        throw new FaucetError(
          FAUCET_ERROR.ALREADY_USED_SERVICE,
          dictionary('alreadyUsedService', {
            service: 'Telegram',
          })
        );
      }
    }

    // TODO: extract the simulate -> write logic into a separate reusable library
    const sessionTokenTxHash = await faucetWallet.writeContract({
      address: addresses.SENT[chain],
      abi: SENTAbi,
      functionName: 'transfer',
      args: [targetAddress, faucetTokenDrip],
    });

    /**
     * If the target wallet has less than the minimum target ETH balance, the wallet will be topped up with test ETH.
     */
    let ethTxHash: Address | undefined;
    const ethTopupValue = minTargetEthBalance - targetEthBalance;
    if (ethTopupValue > 0) {
      const request = await faucetWallet.prepareTransactionRequest({
        to: targetAddress,
        value: ethTopupValue,
      });

      const serializedTransaction = await faucetWallet.signTransaction(request);
      ethTxHash = await faucetWallet.sendRawTransaction({ serializedTransaction });
    }

    const timestamp = Date.now();
    const writeTransactionResult = db
      .prepare(
        `INSERT INTO ${TABLE.TRANSACTIONS} (hash, target, amount, timestamp, discord, telegram, operator, ethhash, ethamount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        sessionTokenTxHash,
        targetAddress,
        faucetTokenDrip.toString(),
        timestamp,
        discordId,
        telegramId,
        usedOperatorAddress ? targetAddress : undefined,
        ethTxHash ?? null,
        ethTopupValue.toString()
      );

    if (writeTransactionResult.changes !== 1) {
      console.warn('Failed to write transaction to database');
    }

    const transactionHistory = getTransactionHistory({ db, address: targetAddress });

    result = new FaucetResult({
      hash: sessionTokenTxHash,
      tokenAmount: faucetTokenDrip.toString(),
      ethTopupHash: ethTxHash,
      ethTopupAmount: ethTopupValue.toString(),
      history: transactionHistory,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof FaucetError) {
      result = new FaucetResult({
        error: error.message,
        faucetError: error.faucetError,
        history: error.history,
      });
    } else if (error instanceof Error) {
      result = new FaucetResult({ error: error.message });
    } else {
      result = new FaucetResult({ error: 'An unknown error occurred' });
    }
  } finally {
    if (db) {
      db.close();
    }

    // eslint-disable-next-line no-unsafe-finally -- this is the only return so its fine
    return {
      hash: result.hash,
      tokenAmount: result.tokenAmount,
      ethTopupHash: result.ethTopupHash,
      ethTopupAmount: result.ethTopupAmount,
      error: result.error,
      faucetError: result.faucetError,
      history: result.history,
    };
  }
}

async function connectFaucetWallet() {
  const privateKey = process.env.FAUCET_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Faucet wallet private key is required');
  }

  if (!isPrivateKey(privateKey)) {
    throw new Error('Invalid faucet wallet private key');
  }

  const faucetWallet = createServerWallet(privateKey, CHAIN.TESTNET);
  const faucetAddress = (await faucetWallet.getAddresses())[0];

  if (!isAddress(faucetAddress)) {
    throw new Error('Faucet wallet address is required');
  }
  return { faucetAddress, faucetWallet };
}
