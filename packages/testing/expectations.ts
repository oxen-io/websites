/**
 * Catches and returns any errors thrown by the given function.
 * @param func - The function to test.
 * @returns The error thrown by the function, or `null` if no error was thrown.
 */
export async function getThrownError(
  func: (...args: Array<unknown>) => Promise<unknown> | unknown
) {
  let caughtError = null;
  try {
    await func();
  } catch (err) {
    caughtError = err;
  }
  return caughtError;
}

/**
 * Expects the given function to catch its own errors.
 * @param func - The function to test.
 *
 * @note calls {@link expect} to assert the function does not throw an error.
 * @note calls {@link getThrownError} to get any errors thrown by the function.
 */
export async function expectFunctionToCatchErrors(
  func: (...args: Array<unknown>) => Promise<unknown> | unknown
) {
  const caughtError = await getThrownError(func);
  expect(caughtError).toBeNull();
}
