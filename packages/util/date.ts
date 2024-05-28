/**
 * Returns the current Unix timestamp. This is the number of seconds that have elapsed since the Unix epoch.
 * @returns The current Unix timestamp.
 */
export function getUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}
