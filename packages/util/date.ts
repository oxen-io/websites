/**
 * Checks if the given value is a valid Unix timestamp in seconds.
 * @param value timestamp in seconds
 */
export function isValidUnixTimestampSeconds(value: number): boolean {
  // The Unix timestamp is a way to track time as a running total of seconds.
  // It counts the number of seconds since January 1, 1970 (UTC).
  // Hence, it should be a non-negative number.
  if (typeof value !== 'number' || value < 0) {
    return false;
  }

  const date = new Date(value);
  return date instanceof Date && !Number.isNaN(date);
}

/**
 * Returns the current Unix timestamp in seconds. This is the number of seconds that have elapsed since the Unix epoch.
 * @returns The current Unix timestamp in seconds.
 */
export function getUnixTimestampNowSeconds() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Returns the Unix timestamp in seconds from the given date.
 * @param date - The date object to convert.
 * @returns The Unix timestamp in seconds.
 */
export function getUnixTimestampSecondsFromDate(date: Date) {
  return Math.floor(date.getTime() / 1000);
}
