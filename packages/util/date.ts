/**
 * Checks if the given value is a valid Unix timestamp in seconds.
 * @param value timestamp in seconds
 */
export function isValidUnixTimestampSeconds(value: number): boolean {
  // The Unix timestamp is a way to track time as a running total of seconds.
  // It counts the number of seconds since January 1, 1970 (UTC).
  // Hence, it should be a non-negative number.
  if (typeof value !== 'number' || value < 0 || !Number.isInteger(value)) {
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

/**
 * Returns the {@link Date} object for a unix timestamp in seconds.
 * @param timestamp A unix timestamp in seconds
 * @return The {@link Date} object for the timestamp
 */
export function getDateFromUnixTimestampSeconds(timestamp: number) {
  return new Date(timestamp * 1000);
}

/**
 * Returns the time between two events.
 * This is unit agnostic, both positions and the velocity must be in the
 * same units and of the same unit magnitude.
 * @param event1Position The position of event 1.
 * @param event2Position The position of event 2.
 * @param velocity The velocity between event 1 and event 2.
 *
 * @example Basic Usage
 * ```ts
 * const ms = timeBetweenEvents(1, 50, 10) // 5 ms
 * ```
 */
export function timeBetweenEvents(
  event1Position: number,
  event2Position: number,
  velocity: number
) {
  return Math.round(Math.abs(event2Position - event1Position) / velocity);
}
