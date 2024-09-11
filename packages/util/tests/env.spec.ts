import { Environment, getEnvironment, getEnvironmentTaggedDomain, isProduction } from '../env';

let mockConsoleLog: jest.SpyInstance;
let mockConsoleWarn: jest.SpyInstance;

beforeEach(() => {
  mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
});

// #region - getEnvironment

describe('getEnvironment', () => {
  test('getEnvironment should return the environment when a valid environment flag is provided', () => {
    process.env.NEXT_PUBLIC_ENV_FLAG = Environment.PRD;
    const result = getEnvironment();
    expect(result).toBe(Environment.PRD);
    expect(mockConsoleWarn).not.toHaveBeenCalled();
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  test('getEnvironment should return the default environment (DEV) when an invalid environment flag is provided', () => {
    process.env.NEXT_PUBLIC_ENV_FLAG = 'invalid';
    const result = getEnvironment();
    expect(result).toBe(Environment.DEV);
    expect(mockConsoleWarn).toHaveBeenCalled();
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  test('getEnvironment should return the default environment (DEV) when no environment flag is provided', () => {
    delete process.env.NEXT_PUBLIC_ENV_FLAG;
    expect(process.env.NEXT_PUBLIC_ENV_FLAG).toBeUndefined();
    const result = getEnvironment();
    expect(result).toBe(Environment.DEV);
    expect(mockConsoleWarn).toHaveBeenCalled();
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });
});

// #endregion
// #region - isProduction

describe('isProduction', () => {
  test('isProduction should return true when the environment is PRD', () => {
    process.env.NEXT_PUBLIC_ENV_FLAG = Environment.PRD;
    const result = isProduction();
    expect(result).toBe(true);
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  test('isProduction should return false when the environment is not PRD', () => {
    process.env.NEXT_PUBLIC_ENV_FLAG = Environment.STG;
    const result = isProduction();
    expect(result).toBe(false);
    expect(mockConsoleLog).toHaveBeenCalled();
  });
});

// #endregion
// #region - getEnvironmentTaggedDomain

describe('getEnvironmentTaggedDomain', () => {
  test('getEnvironmentTaggedDomain should return the domain with environment tag when root subdomain is provided and environment is PRD', () => {
    const rootSubdomain = 'example';
    process.env.NEXT_PUBLIC_ENV_FLAG = Environment.PRD;
    const result = getEnvironmentTaggedDomain(rootSubdomain);
    expect(result).toBe(rootSubdomain);
    expect(mockConsoleLog).toHaveBeenCalled();
  });

  test('getEnvironmentTaggedDomain should return the domain with environment tag when root subdomain is provided and environment is not PRD', () => {
    const rootSubdomain = 'example';
    process.env.NEXT_PUBLIC_ENV_FLAG = Environment.STG;
    const result = getEnvironmentTaggedDomain(rootSubdomain);
    expect(result).toBe(`${rootSubdomain}-${Environment.STG}`);
    expect(mockConsoleLog).toHaveBeenCalled();
  });

  test('getEnvironmentTaggedDomain should return an empty string when no root subdomain is provided and environment is PRD', () => {
    process.env.NEXT_PUBLIC_ENV_FLAG = Environment.PRD;
    const result = getEnvironmentTaggedDomain();
    expect(result).toBe('');
    expect(mockConsoleLog).toHaveBeenCalled();
  });

  test('getEnvironmentTaggedDomain should return the environment when no root subdomain is provided and environment is not PRD', () => {
    process.env.NEXT_PUBLIC_ENV_FLAG = Environment.STG;
    const result = getEnvironmentTaggedDomain();
    expect(result).toBe(Environment.STG);
    expect(mockConsoleLog).toHaveBeenCalled();
  });
});

// #endregion
