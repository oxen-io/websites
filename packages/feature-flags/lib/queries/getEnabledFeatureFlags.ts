import * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import { FLAGS_TABLE, type FlagsRow, TABLE } from '../db';

export function getEnabledFeatureFlags({ db }: { db: BetterSql3.Database }): Array<FlagsRow> {
  return db
    .prepare(`SELECT ${FLAGS_TABLE.FLAG} FROM ${TABLE.FLAGS} WHERE ${FLAGS_TABLE.ENABLED} = 1`)
    .all() as Array<FlagsRow>;
}