import { isProduction } from '@session/util-js/env';
import Database, * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import path from 'path';
import { Address } from 'viem';

export enum TABLE {
  TRANSACTIONS = 'transactions',
  OPERATOR = 'operator',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  FAUCET = 'faucet',
}

export enum FAUCET_TABLE {
  OPERATOR_LAST_UPDATE = 'operator_last_update',
}

export enum TRANSACTIONS_TABLE {
  HASH = 'hash',
  TARGET = 'target',
  AMOUNT = 'amount',
  TIMESTAMP = 'timestamp',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  OPERATOR = 'operator',
  ETHHASH = 'ethhash',
  ETHAMOUNT = 'ethamount',
}

export enum OPERATOR_TABLE {
  ID = 'id',
}

export enum DISCORD_TABLE {
  ID = 'id',
}

export enum TELEGRAM_TABLE {
  ID = 'id',
}

export interface OperatorRow {
  id: string;
}

export interface DiscordRow {
  id: string;
}

export interface TelegramRow {
  id: string;
}

export interface TransactionsRow {
  hash: string;
  to: string;
  amount: number;
  timestamp: number;
  discord?: string;
  telegram?: string;
  operator?: string;
}

export const openDatabase = (fileMustExist = true): BetterSql3.Database => {
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

export const setupDatababse = () => {
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
      ${TRANSACTIONS_TABLE.OPERATOR} TEXT,
      ${TRANSACTIONS_TABLE.ETHHASH} TEXT,
      ${TRANSACTIONS_TABLE.ETHAMOUNT} TEXT
    );`
  ).run();

  /* db.prepare(
    `ALTER TABLE ${TABLE.TRANSACTIONS} ADD COLUMN ${TRANSACTIONS_TABLE.ETHHASH} TEXT;`
  ).run();
  db.prepare(
    `ALTER TABLE ${TABLE.TRANSACTIONS} ADD COLUMN ${TRANSACTIONS_TABLE.ETHAMOUNT} TEXT;`
  ).run(); */

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

interface DiscordIdExport {
  id: string;
  name: string;
  roles: Array<string>;
  joined_at: string;
}

interface TelegramIdExport {
  id: number;
  username: string | null;
  status: string;
}

interface OperatorAddressExport {
  address: string;
  destination: string;
  share: string;
}

export const importDiscordIds = (discordExport: Array<DiscordIdExport>) => {
  let db: BetterSql3.Database | undefined;

  try {
    const db = openDatabase();

    const insert = db.prepare(`INSERT INTO ${TABLE.DISCORD} (${DISCORD_TABLE.ID}) VALUES (?)`);

    const transaction = db.transaction((discordExport: Array<DiscordIdExport>) => {
      for (const { id } of discordExport) {
        insert.run(id);
      }
    });

    transaction(discordExport);
  } catch (error) {
    console.error('Failed to import Discord IDs', error);
  } finally {
    if (db) {
      db.close();
    }
  }
};

export const importTelegramIds = (telegramExport: Array<TelegramIdExport>) => {
  let db: BetterSql3.Database | undefined;

  try {
    const db = openDatabase();

    const insert = db.prepare(`INSERT INTO ${TABLE.TELEGRAM} (${TELEGRAM_TABLE.ID}) VALUES (?)`);

    const transaction = db.transaction((telegramExport: Array<TelegramIdExport>) => {
      for (const { id } of telegramExport) {
        insert.run(BigInt(id).toString());
      }
    });

    transaction(telegramExport);
  } catch (error) {
    console.error('Failed to import Telegram IDs', error);
  } finally {
    if (db) {
      db.close();
    }
  }
};

export const parseCSV = (csv: string) => {
  try {
    const lines = csv.split('\n');

    if (!lines[0]) {
      throw new Error('CSV is empty');
    }

    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
      const values = line.split(',');
      if (values.length !== headers.length) {
        throw new Error('CSV has inconsistent columns');
      }
      return headers.reduce((acc: Record<string, string>, header, index) => {
        acc[header] = values[index]!;
        return acc;
      }, {});
    });
  } catch (error) {
    console.error('Failed to parse CSV', error);
    return [];
  }
};

export const importOperatorIds = (operatorExport: Array<OperatorAddressExport>) => {
  const filtered = operatorExport.filter((row, index, self) => {
    return index === self.findIndex((t) => t.destination === row.destination);
  });

  let db: BetterSql3.Database | undefined;

  try {
    const db = openDatabase();

    const insert = db.prepare(`INSERT INTO ${TABLE.OPERATOR} (${OPERATOR_TABLE.ID}) VALUES (?)`);

    const transaction = db.transaction((operatorExport: Array<OperatorAddressExport>) => {
      for (const { destination } of operatorExport) {
        insert.run(destination);
      }
    });

    transaction(filtered);
  } catch (error) {
    console.error('Failed to import Operator IDs', error);
  } finally {
    if (db) {
      db.close();
    }
  }
};

type CountType<F extends string> = Record<`count(${F})`, number>;

/**
 * Checks if the given row has a count value greater than zero for the specified countField.
 * @param row The row object containing the count value.
 * @param countField The field name for the count value.
 *
 * @returns A boolean indicating whether the count value exists and is greater than zero.
 */
export const hasCount = <F extends string>(row: CountType<F>, countField: F) => {
  const count = row[`count(${countField})`];
  return count && count > 0;
};

type IdTableParams = {
  db: BetterSql3.Database;
  source: TABLE.DISCORD | TABLE.TELEGRAM | TABLE.OPERATOR;
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
export function idIsInTable({ db, source, id }: IdTableParams) {
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
export function hasRecentTransaction({
  db,
  source,
  id,
  hoursBetweenTransactions,
}: IdTableParams & { hoursBetweenTransactions?: number }) {
  const lastTransactionCutoff = hoursBetweenTransactions
    ? Date.now() - hoursBetweenTransactions * 60 * 60 * 1000
    : 0;

  const row = db
    .prepare<
      [IdTableParams['id'], TransactionsRow['timestamp']]
    >(`SELECT count(${source}) FROM ${TABLE.TRANSACTIONS} WHERE ${source} = ? AND timestamp > ?`)
    .get(id, lastTransactionCutoff) as CountType<typeof source>;

  return hasCount(row, source);
}

export type TransactionHistory = {
  [TRANSACTIONS_TABLE.TIMESTAMP]: number;
  [TRANSACTIONS_TABLE.HASH]: string;
  [TRANSACTIONS_TABLE.AMOUNT]: string;
  [TRANSACTIONS_TABLE.ETHHASH]?: string;
  [TRANSACTIONS_TABLE.ETHAMOUNT]?: string;
};

export function getTransactionHistory({
  db,
  address,
}: {
  db: BetterSql3.Database;
  address: Address;
}): Array<TransactionHistory> {
  return db
    .prepare<string>(
      `SELECT ${TRANSACTIONS_TABLE.TIMESTAMP}, ${TRANSACTIONS_TABLE.HASH}, ${TRANSACTIONS_TABLE.AMOUNT}, ${TRANSACTIONS_TABLE.ETHHASH}, ${TRANSACTIONS_TABLE.ETHAMOUNT} FROM ${TABLE.TRANSACTIONS} WHERE ${TRANSACTIONS_TABLE.TARGET} = ? ORDER BY ${TRANSACTIONS_TABLE.TIMESTAMP} DESC`
    )
    .all(address) as Array<TransactionHistory>;
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
