import { bigIntToNumber, formatBigIntTokenValue, formatNumber, roundNumber } from '../maths';

// #region - roundNumber

describe('roundNumber', () => {
  test('when using default decimals', () => {
    expect(roundNumber(1.23456789)).toBe(1.2346);
    expect(roundNumber(123456789)).toBe(123456789);
    expect(roundNumber(123456789.00023456)).toBe(123456789.0002);
    expect(roundNumber(0.00023456789)).toBe(0.0002);
  });

  test('should round to zero to zero', () => {
    expect(roundNumber(0, 2)).toBe(0);
    expect(roundNumber(0, 4)).toBe(0);
    expect(roundNumber(0, 6)).toBe(0);
    expect(roundNumber(0.0, 2)).toBe(0);
    expect(roundNumber(0.0, 4)).toBe(0);
    expect(roundNumber(0.0, 6)).toBe(0);
  });

  test('should round negative values', () => {
    expect(roundNumber(-123456789, 2)).toBe(-123456789);
    expect(roundNumber(-1.23456789, 2)).toBe(-1.23);
    expect(roundNumber(-1.23456789, 3)).toBe(-1.235);
    expect(roundNumber(-1.23456789, 4)).toBe(-1.2346);
  });

  test('should round infinity', () => {
    expect(roundNumber(Infinity, 2)).toBe(Infinity);
    expect(roundNumber(Infinity, 4)).toBe(Infinity);
  });

  test('should round negative infinity', () => {
    expect(roundNumber(-Infinity, 2)).toBe(-Infinity);
    expect(roundNumber(-Infinity, 4)).toBe(-Infinity);
  });

  test('should round NaN', () => {
    expect(roundNumber(NaN, 2)).toBe(NaN);
    expect(roundNumber(NaN, 4)).toBe(NaN);
  });

  test('should format values as expected', () => {
    expect(roundNumber(1.23456789, 1)).toBe(1.2);
    expect(roundNumber(1.23456789, 2)).toBe(1.23);
    expect(roundNumber(1.23456789, 3)).toBe(1.235);
    expect(roundNumber(1.23456789, 4)).toBe(1.2346);
    expect(roundNumber(123456789, 2)).toBe(123456789);
    expect(roundNumber(123456789.00023456, 2)).toBe(123456789);
    expect(roundNumber(0.00023456789, 4)).toBe(0.0002);
    expect(roundNumber(0.00023456789, 2)).toBe(0);
  });
});

// #endregion
// #region - formatNumber

describe('formatNumber', () => {
  test('when using default decimals', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(0.0001)).toBe('0.0001');
    expect(formatNumber(0.0005)).toBe('0.0005');
    expect(formatNumber(0.00001)).toBe('0');
    expect(formatNumber(0.00005)).toBe('0.0001');
    expect(formatNumber(123456)).toBe('123,456');
    expect(formatNumber(123456.0001)).toBe('123,456.0001');
    expect(formatNumber(123456.0005)).toBe('123,456.0005');
    expect(formatNumber(123456.00001)).toBe('123,456');
    expect(formatNumber(123456.00005)).toBe('123,456.0001');
    expect(formatNumber(123456.123)).toBe('123,456.123');
    expect(formatNumber(123456.12301)).toBe('123,456.123');
  });

  test('should format zero as zero', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(0, 2)).toBe('0');
    expect(formatNumber(0, 6)).toBe('0');
    expect(formatNumber(0.0)).toBe('0');
  });

  test('should format negative values', () => {
    expect(formatNumber(-123456789, 2)).toBe('-123,456,789');
    expect(formatNumber(-1.23456789, 2)).toBe('-1.23');
    expect(formatNumber(-1.23456789, 3)).toBe('-1.235');
    expect(formatNumber(-1.23456789, 4)).toBe('-1.2346');
  });

  test('should format infinity', () => {
    expect(formatNumber(Infinity, 2)).toBe('Infinity');
    expect(formatNumber(Infinity, 4)).toBe('Infinity');
  });

  test('should format negative infinity', () => {
    expect(formatNumber(-Infinity, 2)).toBe('-Infinity');
    expect(formatNumber(-Infinity, 4)).toBe('-Infinity');
  });

  test('should format NaN', () => {
    expect(formatNumber(NaN, 2)).toBe('NaN');
    expect(formatNumber(NaN, 4)).toBe('NaN');
  });

  test('should format values as expected', () => {
    expect(formatNumber(1.23456789, 1)).toBe('1.2');
    expect(formatNumber(1.23456789, 2)).toBe('1.23');
    expect(formatNumber(1.23456789, 3)).toBe('1.235');
    expect(formatNumber(1.23456789, 4)).toBe('1.2346');
    expect(formatNumber(123456789, 2)).toBe('123,456,789');
    expect(formatNumber(123456789.00023456, 2)).toBe('123,456,789');
    expect(formatNumber(0.00023456789, 4)).toBe('0.0002');
    expect(formatNumber(0.00023456789, 2)).toBe('0');
  });
});

// #endregion
// #region - bigIntToNumber

describe('bigIntToNumber', () => {
  test('should convert a positive BigInt value to a number with decimals', () => {
    expect(bigIntToNumber(BigInt(1), 4)).toBe(0.0001);
    expect(bigIntToNumber(BigInt(10), 4)).toBe(0.001);
    expect(bigIntToNumber(BigInt(100), 4)).toBe(0.01);
    expect(bigIntToNumber(BigInt(1000), 4)).toBe(0.1);
    expect(bigIntToNumber(BigInt(10000), 4)).toBe(1);
    expect(bigIntToNumber(BigInt(100000), 4)).toBe(10);
    expect(bigIntToNumber(BigInt(1000000), 4)).toBe(100);
    expect(bigIntToNumber(BigInt(10000000), 4)).toBe(1000);
  });

  test('should convert a negative BigInt value to a number with decimals', () => {
    expect(bigIntToNumber(BigInt(-1), 4)).toBe(-0.0001);
    expect(bigIntToNumber(BigInt(-10), 4)).toBe(-0.001);
    expect(bigIntToNumber(BigInt(-100), 4)).toBe(-0.01);
    expect(bigIntToNumber(BigInt(-1000), 4)).toBe(-0.1);
    expect(bigIntToNumber(BigInt(-10000), 4)).toBe(-1);
    expect(bigIntToNumber(BigInt(-100000), 4)).toBe(-10);
    expect(bigIntToNumber(BigInt(-1000000), 4)).toBe(-100);
    expect(bigIntToNumber(BigInt(-10000000), 4)).toBe(-1000);
  });

  test('should convert a BigInt value to a number with decimals', () => {
    expect(bigIntToNumber(BigInt(123456789), 0)).toBe(123456789);
    expect(bigIntToNumber(BigInt(123456789), 1)).toBe(12345678.9);
    expect(bigIntToNumber(BigInt(123456789), 2)).toBe(1234567.89);
    expect(bigIntToNumber(BigInt(123456789), 3)).toBe(123456.789);
    expect(bigIntToNumber(BigInt(123456789), 4)).toBe(12345.6789);
    expect(bigIntToNumber(BigInt(123456789), 5)).toBe(1234.56789);
    expect(bigIntToNumber(BigInt(123456789), 6)).toBe(123.456789);
    expect(bigIntToNumber(BigInt(123456789), 7)).toBe(12.3456789);
    expect(bigIntToNumber(BigInt(123456789), 8)).toBe(1.23456789);
    expect(bigIntToNumber(BigInt(123456789), 9)).toBe(0.123456789);
    expect(bigIntToNumber(BigInt(123456789), 10)).toBe(0.0123456789);
    expect(bigIntToNumber(BigInt(123456789), 11)).toBe(0.00123456789);
    expect(bigIntToNumber(BigInt(123456789), 12)).toBe(0.000123456789);
    expect(bigIntToNumber(BigInt(123456789), 13)).toBe(0.0000123456789);
    expect(bigIntToNumber(BigInt(123456789), 14)).toBe(0.00000123456789);
    expect(bigIntToNumber(BigInt(123456789), 15)).toBe(0.000000123456789);
    expect(bigIntToNumber(BigInt(123456789), 16)).toBe(0.0000000123456789);
  });

  describe('safe for javascript number range', () => {
    const scaledUpperNumberLimit = (2 ** 53 - 1) * 100;
    const scaledLowerNumberLimit = -scaledUpperNumberLimit;

    test('should allow numbers within the safe JavaScript range', () => {
      expect(() => bigIntToNumber(BigInt(10), 9)).not.toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(-10), 9)).not.toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(100000000), 9)).not.toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(-100000000), 9)).not.toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(scaledLowerNumberLimit - 100), 4)).not.toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(scaledLowerNumberLimit + 100), 4)).not.toThrow(RangeError);
    });

    test('should throw a RangeError for values outside the safe JavaScript range', () => {
      expect(() => bigIntToNumber(BigInt(scaledUpperNumberLimit), 2)).not.toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(scaledLowerNumberLimit), 2)).not.toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(scaledUpperNumberLimit + 100), 2)).toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(scaledLowerNumberLimit - 100), 2)).toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(scaledUpperNumberLimit * 2), 2)).toThrow(RangeError);
      expect(() => bigIntToNumber(BigInt(scaledLowerNumberLimit * -2), 2)).toThrow(RangeError);
    });
  });
});

// #endregion
// #region - formatBigIntTokenValue

describe('formatBigIntTokenValue', () => {
  test('should format bigint token values as expected', () => {
    expect(formatBigIntTokenValue(BigInt(1000000000), 9, 4)).toBe('1');
    expect(formatBigIntTokenValue(BigInt(10000000000), 9, 4)).toBe('10');
    expect(formatBigIntTokenValue(BigInt(100000000000), 9, 4)).toBe('100');
    expect(formatBigIntTokenValue(BigInt(1000000000000), 9, 4)).toBe('1,000');
    expect(formatBigIntTokenValue(BigInt(10000000000000), 9, 4)).toBe('10,000');
    expect(formatBigIntTokenValue(BigInt(100000000000000), 9, 4)).toBe('100,000');
    expect(formatBigIntTokenValue(BigInt(1000000000000000), 9, 4)).toBe('1,000,000');
  });

  test('should format bigint token values as expected using defaults', () => {
    expect(formatBigIntTokenValue(BigInt(1000000000), 12)).toBe('0.001');
    expect(formatBigIntTokenValue(BigInt(1000000000), 9)).toBe('1');
    expect(formatBigIntTokenValue(BigInt(1000000000000000), 9)).toBe('1,000,000');
  });

  test('should format bigint token values with decimals as expected', () => {
    expect(formatBigIntTokenValue(BigInt(10111111100), 9, 4)).toBe('10.1111');
    expect(formatBigIntTokenValue(BigInt(101000011111100), 9, 4)).toBe('101,000.0111');
    expect(formatBigIntTokenValue(BigInt(1), 9, 12)).toBe('0.000000001');
    expect(formatBigIntTokenValue(BigInt(1), 9, 12)).toBe('0.000000001');
  });
});

// #endregion
