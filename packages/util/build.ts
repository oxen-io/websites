import { execSync } from 'child_process';

export function getBuildInfo() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- Used to get package.json in the scope of where this is run
  const pkg = require('./package.json');
  const commitHash = execSync('git rev-parse HEAD').toString().trim();

  return {
    env: {
      VERSION: pkg.version,
      COMMIT_HASH: commitHash,
      COMMIT_HASH_PRETTY: commitHash.slice(0, 7),
    },
  };
}
