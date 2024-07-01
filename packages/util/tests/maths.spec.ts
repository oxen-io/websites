import { formatBigIntTokenValue, formatTokenValue, roundTokenValue } from '../maths';

// #region - roundTokenValue

describe('roundTokenValue', () => {
  test('when using default decimals', () => {
    expect(roundTokenValue(1.23456789)).toBe(1.2346);
    expect(roundTokenValue(123456789)).toBe(123456789);
    expect(roundTokenValue(123456789.00023456)).toBe(123456789.0002);
    expect(roundTokenValue(0.00023456789)).toBe(0.0002);
  });

  test('should round to zero to zero', () => {
    expect(roundTokenValue(0, 2)).toBe(0);
    expect(roundTokenValue(0, 4)).toBe(0);
    expect(roundTokenValue(0, 6)).toBe(0);
    expect(roundTokenValue(0.0, 2)).toBe(0);
    expect(roundTokenValue(0.0, 4)).toBe(0);
    expect(roundTokenValue(0.0, 6)).toBe(0);
  });

  test('should round negative values', () => {
    expect(roundTokenValue(-123456789, 2)).toBe(-123456789);
    expect(roundTokenValue(-1.23456789, 2)).toBe(-1.23);
    expect(roundTokenValue(-1.23456789, 3)).toBe(-1.235);
    expect(roundTokenValue(-1.23456789, 4)).toBe(-1.2346);
  });

  test('should round infinity', () => {
    expect(roundTokenValue(Infinity, 2)).toBe(Infinity);
    expect(roundTokenValue(Infinity, 4)).toBe(Infinity);
  });

  test('should round negative infinity', () => {
    expect(roundTokenValue(-Infinity, 2)).toBe(-Infinity);
    expect(roundTokenValue(-Infinity, 4)).toBe(-Infinity);
  });

  test('should round NaN', () => {
    expect(roundTokenValue(NaN, 2)).toBe(NaN);
    expect(roundTokenValue(NaN, 4)).toBe(NaN);
  });

  test('should format values as expected', () => {
    expect(roundTokenValue(1.23456789, 1)).toBe(1.2);
    expect(roundTokenValue(1.23456789, 2)).toBe(1.23);
    expect(roundTokenValue(1.23456789, 3)).toBe(1.235);
    expect(roundTokenValue(1.23456789, 4)).toBe(1.2346);
    expect(roundTokenValue(123456789, 2)).toBe(123456789);
    expect(roundTokenValue(123456789.00023456, 2)).toBe(123456789);
    expect(roundTokenValue(0.00023456789, 4)).toBe(0.0002);
    expect(roundTokenValue(0.00023456789, 2)).toBe(0);
  });
});

// #region - formatTokenValue

describe('formatTokenValue', () => {
  test('when using default decimals', () => {
    expect(formatTokenValue(0)).toBe('0');
    expect(formatTokenValue(0.0001)).toBe('0.0001');
    expect(formatTokenValue(0.0005)).toBe('0.0005');
    expect(formatTokenValue(0.00001)).toBe('0');
    expect(formatTokenValue(0.00005)).toBe('0.0001');
    expect(formatTokenValue(123456)).toBe('123,456');
    expect(formatTokenValue(123456.0001)).toBe('123,456.0001');
    expect(formatTokenValue(123456.0005)).toBe('123,456.0005');
    expect(formatTokenValue(123456.00001)).toBe('123,456');
    expect(formatTokenValue(123456.00005)).toBe('123,456.0001');
    expect(formatTokenValue(123456.123)).toBe('123,456.123');
    expect(formatTokenValue(123456.12301)).toBe('123,456.123');
  });

  test('should format zero as zero', () => {
    expect(formatTokenValue(0)).toBe('0');
    expect(formatTokenValue(0, 2)).toBe('0');
    expect(formatTokenValue(0, 6)).toBe('0');
    expect(formatTokenValue(0.0)).toBe('0');
  });

  test('should format negative values', () => {
    expect(formatTokenValue(-123456789, 2)).toBe('-123,456,789');
    expect(formatTokenValue(-1.23456789, 2)).toBe('-1.23');
    expect(formatTokenValue(-1.23456789, 3)).toBe('-1.235');
    expect(formatTokenValue(-1.23456789, 4)).toBe('-1.2346');
  });

  test('should format infinity', () => {
    expect(formatTokenValue(Infinity, 2)).toBe('Infinity');
    expect(formatTokenValue(Infinity, 4)).toBe('Infinity');
  });

  test('should format negative infinity', () => {
    expect(formatTokenValue(-Infinity, 2)).toBe('-Infinity');
    expect(formatTokenValue(-Infinity, 4)).toBe('-Infinity');
  });

  test('should format NaN', () => {
    expect(formatTokenValue(NaN, 2)).toBe('NaN');
    expect(formatTokenValue(NaN, 4)).toBe('NaN');
  });

  test('should format values as expected', () => {
    expect(formatTokenValue(1.23456789, 1)).toBe('1.2');
    expect(formatTokenValue(1.23456789, 2)).toBe('1.23');
    expect(formatTokenValue(1.23456789, 3)).toBe('1.235');
    expect(formatTokenValue(1.23456789, 4)).toBe('1.2346');
    expect(formatTokenValue(123456789, 2)).toBe('123,456,789');
    expect(formatTokenValue(123456789.00023456, 2)).toBe('123,456,789');
    expect(formatTokenValue(0.00023456789, 4)).toBe('0.0002');
    expect(formatTokenValue(0.00023456789, 2)).toBe('0');
  });
});

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

  test('should format bigint token values with decimals as expected', () => {
    expect(formatBigIntTokenValue(BigInt(10111111100), 9, 4)).toBe('10.1111');
    expect(formatBigIntTokenValue(BigInt(101000011111100), 9, 4)).toBe('101,000.0111');
    expect(formatBigIntTokenValue(BigInt(100021), 9, 4)).toBe('0.0001');
    expect(formatBigIntTokenValue(BigInt(1), 9, 12)).toBe('0.000000001');
  });

  describe('safe for javascript number range', () => {
    const upperNumberLimit = 2 ** 53;
    const lowerNumberLimit = -(2 ** 53);

    test('should allow numbers within the safe JavaScript range', () => {
      expect(() => formatBigIntTokenValue(BigInt(10), 9, 4)).not.toThrow();
      expect(() => formatBigIntTokenValue(BigInt(-10), 9, 4)).not.toThrow();
      expect(() => formatBigIntTokenValue(BigInt(100000000), 9, 4)).not.toThrow();
      expect(() => formatBigIntTokenValue(BigInt(-100000000), 9, 4)).not.toThrow();
      expect(() => formatBigIntTokenValue(BigInt(upperNumberLimit - 1), 9, 4)).not.toThrow();
      expect(() => formatBigIntTokenValue(BigInt(lowerNumberLimit + 1), 9, 4)).not.toThrow();
    });

    test('should throw an error for values outside the safe JavaScript range', () => {
      const expectedError = new RangeError('Value is outside the safe JavaScript range');

      expect(() => formatBigIntTokenValue(BigInt(upperNumberLimit), 9, 4)).toThrow(expectedError);
      expect(() => formatBigIntTokenValue(BigInt(lowerNumberLimit), 9, 4)).toThrow(expectedError);
      expect(() => formatBigIntTokenValue(BigInt(upperNumberLimit * 2), 9, 4)).toThrow(
        expectedError
      );
      expect(() => formatBigIntTokenValue(BigInt(lowerNumberLimit * 2), 9, 4)).toThrow(
        expectedError
      );
    });
  });
});
