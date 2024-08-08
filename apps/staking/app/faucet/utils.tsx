import { isProduction } from '@session/util/env';
import Database, * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import path from 'path';
import { Address } from 'viem';

export enum TABLE {
  TRANSACTIONS = 'transactions',
  CODE = 'code',
  WALLET = 'wallet',
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
  WALLET = 'wallet',
  CODE = 'code',
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

export enum WALLET_TABLE {
  ID = 'id',
  NOTE = 'note',
}

export enum CODE_TABLE {
  ID = 'id',
  WALLET = 'wallet',
  DRIP = 'drip',
  MAXUSES = 'maxuses',
}

export interface TransactionsRow {
  hash: string;
  to: string;
  amount: number;
  timestamp: number;
  discord?: string;
  telegram?: string;
  operator?: string;
  wallet?: string;
  code?: string;
  ethhash?: string;
  ethamount?: string;
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
    `CREATE TABLE IF NOT EXISTS ${TABLE.WALLET} (
      ${WALLET_TABLE.ID} TEXT PRIMARY KEY,
      ${WALLET_TABLE.NOTE} TEXT
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${TABLE.CODE} (
      ${CODE_TABLE.ID} TEXT PRIMARY KEY,
      ${CODE_TABLE.WALLET} TEXT,
      ${CODE_TABLE.DRIP} TEXT,
      ${CODE_TABLE.MAXUSES} INTEGER
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
      ${TRANSACTIONS_TABLE.WALLET} TEXT,
      ${TRANSACTIONS_TABLE.CODE} TEXT,
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
  // db.prepare(
  //   `ALTER TABLE ${TABLE.TRANSACTIONS} ADD COLUMN ${TRANSACTIONS_TABLE.WALLET} TEXT;`
  // ).run();
  // db.prepare(`ALTER TABLE ${TABLE.TRANSACTIONS} ADD COLUMN ${TRANSACTIONS_TABLE.CODE} TEXT;`).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS discord_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.DISCORD}, ${TRANSACTIONS_TABLE.TIMESTAMP}) WHERE ${TRANSACTIONS_TABLE.DISCORD} IS NOT NULL;`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS telegram_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.TELEGRAM}, ${TRANSACTIONS_TABLE.TIMESTAMP}) WHERE ${TRANSACTIONS_TABLE.TELEGRAM} IS NOT NULL;`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS operator_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.OPERATOR}, ${TRANSACTIONS_TABLE.TIMESTAMP}) WHERE ${TRANSACTIONS_TABLE.OPERATOR} IS NOT NULL;`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS operator_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.WALLET}, ${TRANSACTIONS_TABLE.TIMESTAMP}) WHERE ${TRANSACTIONS_TABLE.WALLET} IS NOT NULL;`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS operator_index ON ${TABLE.TRANSACTIONS} (${TRANSACTIONS_TABLE.TARGET}, ${TRANSACTIONS_TABLE.TIMESTAMP}, ${TRANSACTIONS_TABLE.CODE}) WHERE ${TRANSACTIONS_TABLE.CODE} IS NOT NULL;`
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
  source: TABLE.DISCORD | TABLE.TELEGRAM | TABLE.OPERATOR | TABLE.WALLET | TABLE.CODE;
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

type CodeExistsParams = {
  db: BetterSql3.Database;
  code: string;
};

/**
 * Checks if the given referral code exists.
 * @param props Code exists props.
 * @param props.db The database instance.
 * @param props.code The code to check for existence.
 * @returns A boolean indicating whether the code exists in the table.
 */
export function codeExists({ db, code }: CodeExistsParams) {
  return idIsInTable({ db, source: TABLE.CODE, id: code });
}

type CodeDetailParams = CodeExistsParams;

type CodeDetails = {
  id: string;
  wallet?: string;
  drip?: string;
  maxuses?: number;
};

/**
 * Get a referral codes details.
 * @param props Get referral code details props.
 * @param props.db The database instance.
 * @param props.code The code to get details for.
 * @returns The referral code details.
 */
export function getReferralCodeDetails({ db, code }: CodeDetailParams): CodeDetails {
  return db
    .prepare<string>(
      `SELECT ${CODE_TABLE.ID}, ${CODE_TABLE.WALLET}, ${CODE_TABLE.DRIP}, ${CODE_TABLE.MAXUSES} FROM ${TABLE.CODE} WHERE ${CODE_TABLE.ID} = ?`
    )
    .all(code)[0] as CodeDetails;
}

type CodeUseTransactionHistory = TransactionHistory & { target: Address };

/**
 * Get a referral code's transaction history. This is all the times a code was used.
 * @param props Get code transaction history props.
 * @param props.db The database instance.
 * @param props.code The code to get history for.
 * @returns A list of transactions for a referral code.
 */
export function getCodeUseTransactionHistory({
  db,
  code,
}: {
  db: BetterSql3.Database;
  code: string;
}): Array<CodeUseTransactionHistory> {
  return db
    .prepare<string>(
      `SELECT ${TRANSACTIONS_TABLE.TIMESTAMP}, ${TRANSACTIONS_TABLE.HASH}, ${TRANSACTIONS_TABLE.AMOUNT}, ${TRANSACTIONS_TABLE.ETHHASH}, ${TRANSACTIONS_TABLE.ETHAMOUNT}, ${TRANSACTIONS_TABLE.TARGET} FROM ${TABLE.TRANSACTIONS} WHERE ${TRANSACTIONS_TABLE.CODE} = ? ORDER BY ${TRANSACTIONS_TABLE.TIMESTAMP} DESC`
    )
    .all(code) as Array<CodeUseTransactionHistory>;
}

/**
 * Determines if the parameters for generating a number of codes are sufficient for generating
 * the requested number of codes given the available character set and code length.
 * @param numCodes The number of codes to generate.
 * @param codeLength The length of the codes.
 * @param characters The character set to use to create the codes.
 * @returns If the parameters for generating a number of codes is sufficient
 */
function canCreateRequestedCodes(numCodes: number, codeLength: number, characters: string) {
  const numUniqueCombinations = Math.pow(characters.length, codeLength);
  return numUniqueCombinations >= numCodes;
}

const charsets = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  safeAlphanumeric: 'ABCDEFGHJKLMNPRSTUVXYZ0123456789',
  custom: '',
} as const;

type GenerateReferralCodesParams = {
  codeLength: number;
  charset: keyof typeof charsets;
  numberOfCodes: number;
  prefix?: string;
  suffix?: string;
  customCharset?: string;
  existingCodes: Array<string>;
};

/**
 * Generate random unique referral codes.
 * @param props Referral code generator props
 * @param props.codeLength The length of the codes.
 * @param props.charset The characters to use in creating the codes.
 * @param props.numberOfCodes The number of codes to create.
 * @param props.prefix The prefix to use at the start of the code. NOTE: this reduces the number of random characters in the code.
 * @param props.suffix The suffix to use at the end of the code. NOTE: this reduces the number of random characters in the code.
 * @param props.customCharset A custom charset to use if {@link charset} is set to {@link charsets.custom}.
 * @param props.existingCodes A list of existing referral codes to prevent duplication.
 * @returns The generated referral codes.
 */
function generateRandomReferralCodes({
  codeLength,
  charset,
  numberOfCodes,
  prefix,
  suffix,
  customCharset,
  existingCodes,
}: GenerateReferralCodesParams) {
  const codes = new Set<string>();
  const codeRandomLength = codeLength - (prefix?.length ?? 0) - (suffix?.length ?? 0);

  const validChars = charset === 'custom' && customCharset ? customCharset : charsets[charset];

  if (!canCreateRequestedCodes(numberOfCodes, codeRandomLength, validChars)) {
    throw new Error(
      'Unable to generate the requested codes. Too many number of codes, too short length, or too short charset.'
    );
  }

  /**
   * 1. Generate random codes until to the target is reached (internal do-while loop).
   * 2. Remove non-unique codes.
   * 3. If more codes are needed to reach the target, repeat.
   */
  do {
    /**
     * Keeps generating random codes until the number of codes in the set (unique) is equal to the
     * goal numberOfCodes.
     */
    do {
      const code = `${prefix ?? ''}${generateRandomReferralCode(validChars, codeRandomLength)}${suffix ?? ''}`;
      codes.add(code);
    } while (codes.size < numberOfCodes);

    /**
     * Remove any codes from the set that already exist
     */
    existingCodes.forEach((str) => {
      if (codes.has(str)) {
        codes.delete(str);
      }
    });

    /**
     * If any codes have been removed due to a uniqueness collision, keep generating
     * the codes up to the number of codes again and repeat until all the codes are generated and
     * unique
     */
  } while (codes.size < numberOfCodes);

  return codes;
}

/**
 * Generate a random referral code.
 * @param charset The character set to generate the code from.
 * @param codeLength The length of the coed to generate.
 * @returns A randomly generated code.
 */
function generateRandomReferralCode(charset: string, codeLength: number) {
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
}

type AddReferralCodesParams = {
  codes: Set<string>;
  creatorWallet?: string;
  maxUses?: number;
  drip?: bigint;
};

/**
 * Get existing referral codes from the database
 * @param db The database instance
 */
function getExistingReferralCodes(db: BetterSql3.Database) {
  const rows = db.prepare(`SELECT ${CODE_TABLE.ID} FROM ${TABLE.CODE}`).all() as Array<{
    id: string;
  }>;
  return rows.flatMap((row) => row.id);
}

/**
 * Add referral codes to the database
 * @param props Referral code props
 * @param props.codes The codes to add
 * @param props.maxUses The maximum number of uses the codes can have
 * @param props.drip The amount of tokens the code will set to be released
 * @param props.creatorWallet The wallet the code was created with (if it was created for a wallet)
 */
function addReferralCodes({ codes, maxUses, drip, creatorWallet }: AddReferralCodesParams) {
  let db: BetterSql3.Database | undefined;

  try {
    const db = openDatabase();

    const insert = db.prepare(
      `INSERT INTO ${TABLE.CODE} (${CODE_TABLE.ID}, ${CODE_TABLE.WALLET}, ${CODE_TABLE.DRIP}, ${CODE_TABLE.MAXUSES}) VALUES (?, ?, ?, ?)`
    );

    const transaction = db.transaction((newCodes: Set<string>) => {
      for (const code of newCodes) {
        insert.run(code, creatorWallet, drip?.toString(), maxUses);
      }
    });

    transaction(codes);
  } catch (error) {
    console.error('Failed to add referral codes', error);
  } finally {
    if (db) {
      db.close();
    }
  }
}

type CreateReferralCodesParams = {
  db: BetterSql3.Database;
  generateParams: Omit<GenerateReferralCodesParams, 'existingCodes'>;
  addParams: Omit<AddReferralCodesParams, 'codes'>;
};

/**
 * Create referral codes
 * @param props Create referral code props
 * @param props.db The database instance
 * @param props.generateParams params for {@link generateRandomReferralCodes}
 * @param props.addParams params for {@link getExistingReferralCodes}
 */
export function createReferralCodes({
  db,
  generateParams,
  addParams,
}: CreateReferralCodesParams): Set<string> {
  try {
    const existingCodes = getExistingReferralCodes(db);
    const codes = generateRandomReferralCodes({ ...generateParams, existingCodes });
    addReferralCodes({ ...addParams, codes });
    return codes;
  } catch (error) {
    console.error('Failed to creat referral codes', error);
    return new Set<string>();
  }
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
