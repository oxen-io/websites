import * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import Database from 'better-sqlite3-multiple-ciphers';
import path from 'path';
import { isProduction } from '@session/util-js/env';

export enum TABLE {
  FLAGS = 'flags',
}

export enum FLAGS_TABLE {
  FLAG = 'flag',
  ENABLED = 'enabled',
  CONTENT = 'content',
}

export interface FlagsRow {
  flag: string;
}

export interface FlagsRowContent {
  content: string;
}

export type CountType<F extends string> = Record<`count(${F})`, number>;

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

export const openDatabase = (fileMustExist = true): BetterSql3.Database => {
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

  return new Database('db/flags.sqlite', dbOptions);
};

export const setupDatabase = () => {
  const db = openDatabase(false);

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${TABLE.FLAGS} (
      ${FLAGS_TABLE.FLAG} TEXT NOT NULL PRIMARY KEY,
      ${FLAGS_TABLE.ENABLED} INTEGER NOT NULL,
      ${FLAGS_TABLE.CONTENT} TEXT
    );`
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS flag_index ON ${TABLE.FLAGS} (${FLAGS_TABLE.FLAG}) WHERE ${FLAGS_TABLE.ENABLED} IS 1;`
  ).run();

  db.close();
};
