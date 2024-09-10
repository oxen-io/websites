import * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import { FLAGS_TABLE, type FlagsRowContent, TABLE } from '../db';
import type { GenericRemoteFeatureFlag } from '../utils';

export function getFeatureFlagContent<Flag extends GenericRemoteFeatureFlag>({
  db,
  flag,
}: {
  db: BetterSql3.Database;
  flag: Flag;
}) {
  return db
    .prepare(
      `SELECT ${FLAGS_TABLE.CONTENT} FROM ${TABLE.FLAGS} WHERE ${FLAGS_TABLE.FLAG} = ? AND ${FLAGS_TABLE.ENABLED} = 1`
    )
    .get(flag) as FlagsRowContent;
}
