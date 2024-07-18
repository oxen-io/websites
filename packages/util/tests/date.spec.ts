import {
  getDateFromUnixTimestampSeconds,
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

// #region - getDateFromUnixTimestampSeconds

describe('getDateFromUnixTimestampSeconds', () => {
  test('should return the correct Date from Unix timestamp', () => {
    const date = new Date('2022-01-01T00:00:00Z'); // January 1, 2022 00:00:00 UTC
    expect(getDateFromUnixTimestampSeconds(1640995200).toISOString()).toBe(date.toISOString());
  });

  test('should return the correct Date from Unix timestamp for a different timestamp', () => {
    const date = new Date('2023-06-15T12:34:56Z'); // June 15, 2023 12:34:56 UTC
    expect(getDateFromUnixTimestampSeconds(1686832496).toISOString()).toBe(date.toISOString());
  });

  test('should return the correct Date from Unix timestamp for a timestamp in the past', () => {
    const date = new Date('2000-05-10T08:15:30Z'); // May 10, 2000 08:15:30 UTC
    expect(getDateFromUnixTimestampSeconds(957946530).toISOString()).toBe(date.toISOString());
  });

  test('should return the correct Date from Unix timestamp for a timestamp in the future', () => {
    const date = new Date('2050-12-31T23:59:59Z'); // December 31, 2050 23:59:59 UTC
    expect(getDateFromUnixTimestampSeconds(2556143999).toISOString()).toBe(date.toISOString());
  });
});

// #endregion
// #region - timeBetweenEvents

describe('timeBetweenEvents', () => {
  test('should return the correct TimeBetween timestamp', () => {
    expect(timeBetweenEvents(1, 2, 1)).toBe(1);
    expect(timeBetweenEvents(1, 100, 10)).toBe(10);
    expect(timeBetweenEvents(1, 50, 10)).toBe(5);
    expect(timeBetweenEvents(0, 2, 1)).toBe(2);
  });

  test('should return the correct TimeBetween timestamp regardless of order', () => {
    expect(timeBetweenEvents(2, 1, 1)).toBe(1);
    expect(timeBetweenEvents(100, 1, 10)).toBe(10);
    expect(timeBetweenEvents(50, 1, 10)).toBe(5);
    expect(timeBetweenEvents(2, 0, 1)).toBe(2);
  });

  test('should return 0 TimeBetween timestamp when velocity is more than twice the distance', () => {
    expect(timeBetweenEvents(50, 55, 20)).toBe(0);
    expect(timeBetweenEvents(15, 15, 1)).toBe(0);
    expect(timeBetweenEvents(15, 15, 11)).toBe(0);
  });

  test('should return the correct TimeBetween timestamp for negative velocity', () => {
    expect(timeBetweenEvents(1, 2, -1)).toBe(-1);
    expect(timeBetweenEvents(1, 100, -10)).toBe(-10);
    expect(timeBetweenEvents(0, 2, -1)).toBe(-2);
  });
});

// #endregion
