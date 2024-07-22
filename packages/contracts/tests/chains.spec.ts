import { CHAIN, chains, ethereum, isChain, mainnet, testnet } from '../chains';

// #region - isChain

describe('isChain', () => {
  test('should return true for valid chains', () => {
    expect(isChain(CHAIN.MAINNET)).toBe(true);
    expect(isChain(CHAIN.TESTNET)).toBe(true);
    expect(isChain(CHAIN.ETHEREUM)).toBe(true);
  });

  test('should return false for invalid chains', () => {
    expect(isChain('invalid')).toBe(false);
    expect(isChain('')).toBe(false);
    expect(isChain('123')).toBe(false);
    expect(isChain('potatochain')).toBe(false);
    // @ts-expect-error - Testing invalid input
    expect(isChain(12)).toBe(false);
  });
});

// #endregion
// #region - chains object

describe('chains object', () => {
  test('should have the correct keys', () => {
    const obj = Object.keys(chains);

    expect(obj).toContain(CHAIN.MAINNET);
    expect(obj).toContain(CHAIN.TESTNET);
    expect(obj).toContain(CHAIN.ETHEREUM);
  });

  test('should have the correct values', () => {
    const obj = Object.values(chains);

    expect(obj).toContainEqual(mainnet);
    expect(obj).toContainEqual(testnet);
    expect(obj).toContainEqual(ethereum);
  });
});

// #endregion
// #region - chain enum

describe('chain enum', () => {
  test('should have the correct values', () => {
    expect(CHAIN.MAINNET).toBe('mainnet');
    expect(CHAIN.TESTNET).toBe('testnet');
    expect(CHAIN.ETHEREUM).toBe('ethereum');
  });
});

// #endregion
