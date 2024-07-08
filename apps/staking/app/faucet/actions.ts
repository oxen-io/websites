'use server';

import { COMMUNITY_DATE, FAUCET, FAUCET_ERROR, TICKER } from '@/lib/constants';
import {
  CHAIN,
  SENT_DECIMALS,
  SENT_SYMBOL,
  addresses,
  formatSENT,
  isChain,
} from '@session/contracts';
import { SENTAbi } from '@session/contracts/abis';
import { isProduction } from '@session/util/env';
import { ETH_DECIMALS } from '@session/wallet/lib/eth';
import { createPublicWalletClient, createServerWallet } from '@session/wallet/lib/server-wallet';
import Database, * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import { getLocale, getTranslations } from 'next-intl/server';
import path from 'path';
import { formatEther, isAddress as isAddressViem, type Address } from 'viem';
import { FaucetFormSchema } from './AuthModule';

interface DiscordIdExport {
  id: number;
  name: string;
  roles: Array<string>;
  joined_at: string;
}

interface TelegramIdExport {
  id: number;
  username: string | null;
  status: string;
}

const importDiscordIds = (discordExport: Array<DiscordIdExport>) => {
  const db = openDatabase();

  const insert = db.prepare(`INSERT INTO ${TABLE.DISCORD} (${DISCORD_TABLE.ID}) VALUES (?)`);

  const transaction = db.transaction((discordExport: Array<DiscordIdExport>) => {
    for (const { id } of discordExport) {
      insert.run(BigInt(id).toString());
    }
  });

  transaction(discordExport);

  db.close();
};

const importTelegramIds = (telegramExport: Array<TelegramIdExport>) => {
  const db = openDatabase();

  const insert = db.prepare(`INSERT INTO ${TABLE.TELEGRAM} (${TELEGRAM_TABLE.ID}) VALUES (?)`);

  const transaction = db.transaction((telegramExport: Array<TelegramIdExport>) => {
    for (const { id } of telegramExport) {
      insert.run(BigInt(id).toString());
    }
  });

  transaction(telegramExport);

  db.close();
};

enum TABLE {
  TRANSACTIONS = 'transactions',
  OPERATOR = 'operator',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  FAUCET = 'faucet',
}

enum FAUCET_TABLE {
  OPERATOR_LAST_UPDATE = 'operator_last_update',
}

enum TRANSACTIONS_TABLE {
  HASH = 'hash',
  TARGET = 'target',
  AMOUNT = 'amount',
  TIMESTAMP = 'timestamp',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  OPERATOR = 'operator',
}

enum OPERATOR_TABLE {
  ID = 'id',
}

enum DISCORD_TABLE {
  ID = 'id',
}

enum TELEGRAM_TABLE {
  ID = 'id',
}

interface OperatorRow {
  id: string;
}

interface DiscordRow {
  id: string;
}

interface TelegramRow {
  id: string;
}

interface TransactionsRow {
  hash: string;
  to: string;
  amount: number;
  timestamp: number;
  discord?: string;
  telegram?: string;
  operator?: string;
}

class FaucetError extends Error {
  faucetError: FAUCET_ERROR;
  constructor(faucetError: FAUCET_ERROR, message: string) {
    super(message);
    this.name = 'FaucetError';
    this.faucetError = faucetError;
  }
}

class FaucetResult {
  hash?: Address;
  error?: string;
  faucetError?: FAUCET_ERROR;

  constructor({
    hash,
    error,
    faucetError,
  }: {
    hash?: Address;
    error?: string;
    faucetError?: FAUCET_ERROR;
  }) {
    this.hash = hash;
    this.error = error;
    this.faucetError = faucetError;
  }
}

const faucetTokenWarning = BigInt(20000 * Math.pow(10, SENT_DECIMALS));
const faucetGasWarning = BigInt(0.01 * Math.pow(10, ETH_DECIMALS));
const faucetTokenDrip = BigInt(FAUCET.DRIP * Math.pow(10, SENT_DECIMALS));

const minTargetEthBalance = BigInt(FAUCET.MIN_ETH_BALANCE * Math.pow(10, ETH_DECIMALS));

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

const openDatabase = (fileMustExist = true): BetterSql3.Database => {
  const dbSecretKey = process.env.FAUCET_DB_SECRET_KEY;
  if (!dbSecretKey) {
    throw new Error('Faucet database secret key is required');
  }

  const dbOptions: BetterSql3.Options = {
    nativeBinding: path.join(
      './',
      'node_modules',
      'better-sqlite3-multiple-ciphers',
      'build',
      'Release',
      'better_sqlite3.node'
    ),
    fileMustExist,
  };

  if (!isProduction()) {
    dbOptions.verbose = console.log;
  }

  const db = new Database('db/faucet.sqlite', dbOptions);

  // db.pragma('journal_mode = WAL');

  db.pragma(`cipher='sqlcipher'`);
  db.pragma(`legacy=4`);
  db.pragma(`key = '${dbSecretKey}'`);

  return db;
};

const setupDatababse = () => {
  const db = openDatabase(false);
  const dbSecretKey = process.env.FAUCET_DB_SECRET_KEY;
  if (!dbSecretKey) {
    throw new Error('Faucet database secret key is required');
  }

  db.pragma(`rekey='${dbSecretKey}'`);

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${TABLE.FAUCET} (
    ${FAUCET_TABLE.OPERATOR_LAST_UPDATE} INTEGER
  )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${TABLE.OPERATOR} (
      ${OPERATOR_TABLE.ID} TEXT PRIMARY KEY
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${TABLE.DISCORD} (
      ${DISCORD_TABLE.ID} TEXT PRIMARY KEY
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${TABLE.TELEGRAM} (
      ${TELEGRAM_TABLE.ID} TEXT PRIMARY KEY
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${TABLE.TRANSACTIONS} (
      ${TRANSACTIONS_TABLE.HASH} TEXT NOT NULL PRIMARY KEY,
      ${TRANSACTIONS_TABLE.TARGET} TEXT NOT NULL,
      ${TRANSACTIONS_TABLE.AMOUNT} TEXT NOT NULL,
      ${TRANSACTIONS_TABLE.TIMESTAMP} INTEGER NOT NULL,
      ${TRANSACTIONS_TABLE.DISCORD} TEXT,
      ${TRANSACTIONS_TABLE.TELEGRAM} TEXT,
      ${TRANSACTIONS_TABLE.OPERATOR} TEXT
    );`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS discord_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.DISCORD}, ${TRANSACTIONS_TABLE.TIMESTAMP}) WHERE ${TRANSACTIONS_TABLE.DISCORD} IS NOT NULL;`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS telegram_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.TELEGRAM}, ${TRANSACTIONS_TABLE.TIMESTAMP}) WHERE ${TRANSACTIONS_TABLE.TELEGRAM} IS NOT NULL;`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS operator_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.OPERATOR}, ${TRANSACTIONS_TABLE.TIMESTAMP}) WHERE ${TRANSACTIONS_TABLE.OPERATOR} IS NOT NULL;`
  ).run();

  db.close();
};

setupDatababse();

type CountType<F extends string> = Record<`count(${F})`, number>;

/**
 * Checks if the given row has a count value greater than zero for the specified countField.
 * @param row The row object containing the count value.
 * @param countField The field name for the count value.
 *
 * @returns A boolean indicating whether the count value exists and is greater than zero.
 */
const hasCount = <F extends string>(row: CountType<F>, countField: F) => {
  const count = row[`count(${countField})`];
  return count && count > 0;
};

export async function transferTestTokens({
  walletAddress,
  discordId,
  telegramId,
}: FaucetFormSchema) {
  const dictionary = await getTranslations('faucet.form.error');
  const locale = await getLocale();

  let result: FaucetResult = new FaucetResult({});
  let db: undefined | BetterSql3.Database;

  try {
    if (!isAddress(walletAddress)) {
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

    const [targetEthBalance, faucetEthBalance, faucetSENTBalance] = await Promise.all([
      getEthBalance({ address: walletAddress, chain }),
      getEthBalance({ address: faucetAddress, chain }),
      getSessionTokenBalance({ address: faucetAddress, chain }),
    ]);

    /**
     * If the target wallet has less than the minimum required ETH balance, the transaction will fail.
     */
    if (targetEthBalance < minTargetEthBalance) {
      throw new FaucetError(
        FAUCET_ERROR.INSUFFICIENT_ETH,
        dictionary('insufficientEthTextOnly', {
          gasAmount: formatEther(targetEthBalance),
        })
      );
    }

    /**
     * If the faucet wallet has less than the required SENT balance, the transaction will fail.
     */
    if (faucetSENTBalance < faucetTokenDrip) {
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
        `Faucet wallet ${TICKER.ETH} balance (${formatEther(faucetEthBalance)} ${TICKER.ETH}) if below the warning threshold (${formatEther(faucetGasWarning)})`
      );
    }

    /**
     * If the faucet wallet has less than the warning SENT balance, a warning will be logged.
     */
    if (faucetSENTBalance < faucetTokenWarning) {
      console.warn(
        `Faucet wallet ${SENT_SYMBOL} balance (${formatSENT(faucetSENTBalance)} ${SENT_SYMBOL}) if below the warning threshold (${formatSENT(faucetTokenWarning)})`
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
          source: TRANSACTIONS_TABLE.OPERATOR,
          id: walletAddress,
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

      if (hasRecentTransaction({ db, source: TRANSACTIONS_TABLE.OPERATOR, id: walletAddress })) {
        throw new FaucetError(FAUCET_ERROR.ALREADY_USED, dictionary('alreadyUsed'));
      }

      usedOperatorAddress = true;
    }

    /**
     * If the user has provided a Discord ID they must be in the approved list of Discord IDs and not have used the faucet recently.
     */
    if (discordId) {
      if (
        !idIsInTable({
          db,
          source: TRANSACTIONS_TABLE.DISCORD,
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

      if (hasRecentTransaction({ db, source: TRANSACTIONS_TABLE.DISCORD, id: discordId })) {
        throw new FaucetError(
          FAUCET_ERROR.ALREADY_USED_SERVICE,
          dictionary('alreadyUsedService', {
            service: 'Discord',
          })
        );
      }
    }

    /**
     * If the user has provided a Telegram ID they must be in the approved list of Telegram IDs and not have used the faucet recently.
     */
    if (telegramId) {
      if (
        !idIsInTable({
          db,
          source: TRANSACTIONS_TABLE.TELEGRAM,
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

      if (hasRecentTransaction({ db, source: TRANSACTIONS_TABLE.TELEGRAM, id: telegramId })) {
        throw new FaucetError(
          FAUCET_ERROR.ALREADY_USED_SERVICE,
          dictionary('alreadyUsedService', {
            service: 'Telegram',
          })
        );
      }
    }

    const hash = await faucetWallet.writeContract({
      address: addresses.SENT[chain],
      abi: SENTAbi,
      functionName: 'transfer',
      args: [walletAddress, faucetTokenDrip],
    });

    const timestamp = Date.now();
    const writeTransactionResult = db
      .prepare(
        `INSERT INTO ${TABLE.TRANSACTIONS} (hash, target, amount, timestamp, discord, telegram, operator) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        hash,
        walletAddress,
        faucetTokenDrip.toString(),
        timestamp,
        discordId,
        telegramId,
        usedOperatorAddress ? walletAddress : undefined
      );

    if (writeTransactionResult.changes !== 1) {
      console.warn('Failed to write transaction to database');
    }

    result = new FaucetResult({ hash });
  } catch (error) {
    if (error instanceof FaucetError) {
      result = new FaucetResult({ error: error.message, faucetError: error.faucetError });
    } else if (error instanceof Error) {
      result = new FaucetResult({ error: error.message });
    } else {
      result = new FaucetResult({ error: 'An unknown error occurred' });
    }
  } finally {
    if (db) {
      db.close();
    }

    return {
      hash: result.hash,
      error: result.error,
      faucetError: result.faucetError,
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

type IdTableParams = {
  db: BetterSql3.Database;
  source: TRANSACTIONS_TABLE.DISCORD | TRANSACTIONS_TABLE.TELEGRAM | TRANSACTIONS_TABLE.OPERATOR;
  id: string;
};

/**
 * Checks if the given ID exists in the specified table of the database.
 *
 * @param db The database instance.
 * @param source The name of the table to search in.
 * @param id The ID to check for existence.
 * @returns A boolean indicating whether the ID exists in the table.
 */
function idIsInTable({ db, source, id }: IdTableParams) {
  const field = 'id';
  const row = db
    .prepare<string>(`SELECT count(${field}) FROM ${source} WHERE ${field} = ?`)
    .get(id) as CountType<typeof field>;

  return hasCount(row, field);
}

/**
 * Checks if a recent transaction exists for the given id in the specified source.
 *
 * @param db The database connection.
 * @param source The name of the source.
 * @param id The id to check for recent transactions.
 * @returns A boolean indicating whether a recent transaction exists.
 */
function hasRecentTransaction({ db, source, id }: IdTableParams) {
  const hoursBetweenTransactions = process.env.FAUCET_HOURS_BETWEEN_USES;
  const lastTransactionCutoff = hoursBetweenTransactions
    ? Date.now() - parseInt(hoursBetweenTransactions) * 60 * 60 * 1000
    : 0;

  const row = db
    .prepare<
      [IdTableParams['id'], TransactionsRow['timestamp']]
    >(`SELECT count(${source}) FROM ${TABLE.TRANSACTIONS} WHERE ${source} = ? AND timestamp > ?`)
    .get(id, lastTransactionCutoff) as CountType<typeof source>;

  return hasCount(row, source);
}
/* 
interface NodeOperatorScoreResponse {
  global_score: number;
  total_snapshots: number;
  wallets: {
    address: {
      percent: number;
      score: number;
      snapshots: number;
    };
  };
}

function didOperatorTableUpdateRecently(db: BetterSql3.Database) {
  const minutesBetweenOperatorTableUpdates =
    process.env.FAUCET_MINUTES_BETWEEN_OPERATOR_TABLE_UPDATES;

  const operatorTableTimestampCutoff = minutesBetweenOperatorTableUpdates
    ? Date.now() - parseInt(minutesBetweenOperatorTableUpdates) * 60 * 1000
    : 0;

  if (!operatorTableTimestampCutoff) return false;

  const lastUpdate = db
    .prepare(`SELECT ${FAUCET_TABLE.OPERATOR_LAST_UPDATE} FROM ${TABLE.FAUCET}`)
    .get() as { [FAUCET_TABLE.OPERATOR_LAST_UPDATE]: number };

  console.log('lastUpdate', lastUpdate);

  if (!lastUpdate || !lastUpdate[FAUCET_TABLE.OPERATOR_LAST_UPDATE]) {
    return false;
  }

  return lastUpdate[FAUCET_TABLE.OPERATOR_LAST_UPDATE] > operatorTableTimestampCutoff;
}

async function updateNodeOperatorTable({ db }: { db: BetterSql3.Database }) {
  const nodeOperatorRes = await fetch('/oxen-swap');

  if (!nodeOperatorRes.ok) {
    console.error('Failed to fetch node operator data');
    return;
  }

  const { wallets } = (await nodeOperatorRes.json()) as NodeOperatorScoreResponse;

  const walletAddresses = Object.keys(wallets);

  const insert = db.prepare(`INSERT INTO ${TABLE.OPERATOR} (${OPERATOR_TABLE.ID}) VALUES (?)`);

  const transaction = db.transaction((walletAddresses: Array<string>) => {
    for (const address of walletAddresses) {
      insert.run(address);
    }
  });

  transaction(walletAddresses);
}
 */
