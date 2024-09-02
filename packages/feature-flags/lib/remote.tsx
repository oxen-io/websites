'use server';

import * as BetterSql3 from 'better-sqlite3-multiple-ciphers';
import { hasCount, openDatabase, setupDatabase } from './db';
import { getEnabledFeatureFlags } from './queries/getEnabledFeatureFlags';
import { getEnabledFeatureFlag } from './queries/getEnabledFeatureFlag';
import type { GenericRemoteFeatureFlag } from './utils';
import { getFeatureFlagContent } from './queries/getFeatureFlagContent';

type GetRemoteFeatureFlagResponse = {
  enabled: boolean;
  error?: unknown;
};

type GetRemoteFeatureFlagsResponse<Flag extends GenericRemoteFeatureFlag> = {
  flags: Array<Flag>;
  error?: unknown;
};

type GetRemoteFeatureFlagContentResponse = {
  content: string;
  error?: unknown;
};

export async function getRemoteFeatureFlagGeneric<Flag extends GenericRemoteFeatureFlag>(
  flag: Flag
): Promise<GetRemoteFeatureFlagResponse> {
  let db: BetterSql3.Database | undefined;
  try {
    db = openDatabase();
    const enabledFlagRow = getEnabledFeatureFlag<Flag>({ db, flag });
    const enabled = hasCount<Flag>(enabledFlagRow, flag);
    return {
      enabled,
    };
  } catch (e) {
    console.error(e);
    return {
      enabled: false,
      error: e,
    };
  } finally {
    if (db) {
      db.close();
    }
  }
}

export async function getRemoteFeatureFlagContentGeneric<Flag extends GenericRemoteFeatureFlag>(
  flag: Flag
): Promise<GetRemoteFeatureFlagContentResponse> {
  let db: BetterSql3.Database | undefined;
  try {
    db = openDatabase();
    const content = getFeatureFlagContent<Flag>({ db, flag })[0]?.content ?? '';
    return {
      content,
    };
  } catch (e) {
    console.error(e);
    return {
      content: '',
      error: e,
    };
  } finally {
    if (db) {
      db.close();
    }
  }
}

export async function getRemoteFeatureFlagsGeneric<
  Flag extends GenericRemoteFeatureFlag,
>(): Promise<GetRemoteFeatureFlagsResponse<Flag>> {
  let db: BetterSql3.Database | undefined;
  try {
    db = openDatabase();
    const enabledFlagsRows = getEnabledFeatureFlags({ db });
    const flags = enabledFlagsRows.flatMap((row) => row.flag) as Array<Flag>;
    return {
      flags,
    };
  } catch (e) {
    console.error(e);
    return {
      flags: [],
      error: e,
    };
  } finally {
    if (db) {
      db.close();
    }
  }
}

setupDatabase();
