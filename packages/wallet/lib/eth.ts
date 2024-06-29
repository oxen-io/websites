/** TODO - Look into improving the eth window type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- eth provider is not typed but this matches what it should be
export type EthereumWindowProvider = { request(...args: any): Promise<any> };

/**
 * Checks if the provided object is an instance of EthereumWindowProvider.
 * @param provider - The object to be checked.
 * @returns True if the object is an instance of EthereumWindowProvider, false otherwise.
 */
export const isEthereumWindowProvider = (provider: unknown): provider is EthereumWindowProvider => {
  return typeof (provider as EthereumWindowProvider)?.request === 'function';
};

/**W
 * Retrieves the Ethereum window provider object if available.
 *
 * @returns The Ethereum window provider object if available, or `undefined` if not found.
 */
export function getEthereumWindowProvider(): EthereumWindowProvider | undefined {
  if (typeof window === 'undefined') {
    console.error('Unable to get ethereum provider from window object as window is undefined');
    return undefined;
  }

  if (!('ethereum' in window) || !isEthereumWindowProvider(window.ethereum)) {
    return undefined;
  }

  return window.ethereum;
}
