import { execSync } from 'child_process';
import { getBuildInfo } from '../build';

// #region - getBuildInfo

describe('getBuildInfo', () => {
  test('should return an object with the correct environment variables', () => {
    const buildInfo = getBuildInfo();

    expect(buildInfo.env).toHaveProperty('VERSION');
    expect(buildInfo.env).toHaveProperty('COMMIT_HASH');
    expect(buildInfo.env).toHaveProperty('COMMIT_HASH_PRETTY');
  });

  test('should return the correct version from package.json', () => {
    const buildInfo = getBuildInfo();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../package.json');

    expect(buildInfo.env.VERSION).toBe(pkg.version);
  });

  test('should return the correct commit hash', () => {
    const buildInfo = getBuildInfo();
    const commitHash = execSync('git rev-parse HEAD').toString().trim();

    expect(buildInfo.env.COMMIT_HASH).toBe(commitHash);
  });

  test('should return the correct shortened commit hash', () => {
    const buildInfo = getBuildInfo();
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    const shortenedCommitHash = commitHash.slice(0, 7);

    expect(buildInfo.env.COMMIT_HASH_PRETTY).toBe(shortenedCommitHash);
  });
});
