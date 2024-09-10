import * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import { type CountType, FLAGS_TABLE, TABLE } from '../db';
import type { GenericRemoteFeatureFlag } from '../utils';

export function getEnabledFeatureFlag<Flag extends GenericRemoteFeatureFlag>({
  db,
  flag,
}: {
  db: BetterSql3.Database;
  flag: Flag;
}) {
  return db
    .prepare(
      `SELECT count(${flag}) FROM ${TABLE.FLAGS} WHERE ${FLAGS_TABLE.FLAG} = ? AND ${FLAGS_TABLE.ENABLED} = 1`
    )
    .get(flag) as CountType<Flag>;
}
