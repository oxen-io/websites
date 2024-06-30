import {
  getUnixTimestampNowSeconds,
  getUnixTimestampSecondsFromDate,
  isValidUnixTimestampSeconds,
} from '../date';

// #region - isValidUnixTimestampSeconds

describe('isValidUnixTimestampSeconds', () => {
  test('should return true for valid timestamp', () => {
    expect(isValidUnixTimestampSeconds(1625097600)).toBe(true); // June 30, 2021 00:00:00 UTC
    expect(isValidUnixTimestampSeconds(0)).toBe(true); // January 1, 1970 00:00:00 UTC
  });

  test('should return false for invalid timestamp', () => {
    expect(isValidUnixTimestampSeconds(-1)).toBe(false); // Negative timestamp
    expect(isValidUnixTimestampSeconds(NaN)).toBe(false); // NaN
    expect(isValidUnixTimestampSeconds(Infinity)).toBe(false); // Infinity
    expect(isValidUnixTimestampSeconds(-Infinity)).toBe(false); // -Infinity
    expect(isValidUnixTimestampSeconds(1.5)).toBe(false); // Decimal value
    // @ts-expect-error - Invalid argument type
    expect(isValidUnixTimestampSeconds('1625097600')).toBe(false); // String value
  });
});

// #region - getUnixTimestampNowSeconds

describe('getUnixTimestampNowSeconds', () => {
  test('should return a valid Unix timestamp', () => {
    const timestamp = getUnixTimestampNowSeconds();
    expect(isValidUnixTimestampSeconds(timestamp)).toBe(true);
  });

  test('should return the current Unix timestamp', () => {
    const now = Date.now();
    const timestamp = getUnixTimestampNowSeconds();
    const difference = Math.abs(timestamp - Math.floor(now / 1000));
    expect(difference).toBeLessThanOrEqual(1); // Allow a difference of 1 second
  });
});

// #region - getUnixTimestampSecondsFromDate

describe('getUnixTimestampSecondsFromDate', () => {
  test('should return the correct Unix timestamp', () => {
    const date = new Date('2022-01-01T00:00:00Z'); // January 1, 2022 00:00:00 UTC
    expect(getUnixTimestampSecondsFromDate(date)).toBe(1640995200);
  });

  test('should return the correct Unix timestamp for a different date', () => {
    const date = new Date('2023-06-15T12:34:56Z'); // June 15, 2023 12:34:56 UTC
    expect(getUnixTimestampSecondsFromDate(date)).toBe(1686832496);
  });

  test('should return the correct Unix timestamp for a date in the past', () => {
    const date = new Date('2000-05-10T08:15:30Z'); // May 10, 2000 08:15:30 UTC
    expect(getUnixTimestampSecondsFromDate(date)).toBe(957946530);
  });

  test('should return the correct Unix timestamp for a date in the future', () => {
    const date = new Date('2050-12-31T23:59:59Z'); // December 31, 2050 23:59:59 UTC
    expect(getUnixTimestampSecondsFromDate(date)).toBe(2556143999);
  });
});
