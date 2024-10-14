import { areHexesEqual, collapseString } from '../src/string';

// #region - collapseString

describe('collapseString', () => {
  test('should collapse the string with default leading and trailing characters', () => {
    const str = 'This is a long string that needs to be collapsed';
    const collapsed = collapseString(str);
    expect(collapsed).toBe('This i…psed');
  });

  test('should collapse the string with custom leading and trailing characters', () => {
    const str = 'This is a long string that needs to be collapsed';
    const collapsed = collapseString(str, 10, 8);
    expect(collapsed).toBe('This is a …ollapsed');
  });

  test('should not collapse the string if it is already short', () => {
    const str = 'Short string';
    const collapsed = collapseString(str);
    expect(collapsed).toBe(str);
  });

  test('should return an empty string if the input string is empty', () => {
    const collapsed = collapseString('');
    expect(collapsed).toBe('');
  });

  test('should return an the whole string if the input string is shorter than the leading and trailing characters', () => {
    const collapsed = collapseString('Short', 10, 8);
    expect(collapsed).toBe('Short');
  });
});

// #endregion
// #region - hexesAreEqual

describe('hexesAreEqual', () => {
  test('should return false for 0x only strings', () => {
    expect(areHexesEqual('abc123', '0x')).toBe(false);
    expect(areHexesEqual('0x', 'abc123')).toBe(false);
    expect(areHexesEqual('0x', '0x')).toBe(false);
  });

  test('should return false for too short strings', () => {
    expect(areHexesEqual('abc123', 'a')).toBe(false);
    expect(areHexesEqual('a', 'abc123')).toBe(false);
    expect(areHexesEqual('ab', 'ab')).toBe(false);
    expect(areHexesEqual('a', 'a')).toBe(false);
  });

  test('should return true for equal strings', () => {
    expect(areHexesEqual('abc123', 'abc123')).toBe(true);
    expect(areHexesEqual('hex', 'hex')).toBe(true);
    expect(areHexesEqual('0xhex', '0xhex')).toBe(true);
  });

  test('should return true for mixed capital equal strings', () => {
    expect(areHexesEqual('aBc123', 'abc123')).toBe(true);
    expect(areHexesEqual('hex', 'hEX')).toBe(true);
    expect(areHexesEqual('0XHex', '0xHex')).toBe(true);
  });

  test('should return false for falsy strings', () => {
    expect(areHexesEqual('', 'a')).toBe(false);
    expect(areHexesEqual('a', '')).toBe(false);
    expect(areHexesEqual('', '')).toBe(false);
    expect(areHexesEqual(undefined, 'a')).toBe(false);
    expect(areHexesEqual('a', undefined)).toBe(false);
    expect(areHexesEqual(undefined, undefined)).toBe(false);
  });
});

// #endregion
