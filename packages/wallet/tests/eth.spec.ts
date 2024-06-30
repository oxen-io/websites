import { getEthereumWindowProvider, isEthereumWindowProvider } from '../lib/eth';

// #region - isEthereumWindowProvider

describe('isEthereumWindowProvider', () => {
  test('should return true for valid EthereumWindowProvider object', () => {
    const provider = {
      request: () => Promise.resolve(),
    };
    expect(isEthereumWindowProvider(provider)).toBe(true);
  });

  test('should return false for invalid EthereumWindowProvider object', () => {
    const provider = {};
    expect(isEthereumWindowProvider(provider)).toBe(false);
  });

  test('should return false for non-EthereumWindowProvider object', () => {
    const provider = {
      otherMethod: () => {},
    };
    expect(isEthereumWindowProvider(provider)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isEthereumWindowProvider(undefined)).toBe(false);
  });

  test('should return false for undefined', () => {
    const provider = undefined;
    expect(isEthereumWindowProvider(provider)).toBe(false);
  });
});

// #region - getEthereumWindowProvider

describe('getEthereumWindowProvider', () => {
  let windowSpy: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    windowSpy.mockRestore();
    mockConsoleError.mockRestore();
  });

  test('should call window object', () => {
    getEthereumWindowProvider();
    expect(windowSpy).toHaveBeenCalled();
  });

  test('should return undefined if window is undefined', () => {
    // Mock window as undefined
    windowSpy.mockImplementation(() => undefined);

    const provider = getEthereumWindowProvider();
    expect(provider).toBeUndefined();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  test('should return undefined if window.ethereum is not present (empty)', () => {
    // Mock window without ethereum
    windowSpy.mockImplementation(() => ({}));

    const provider = getEthereumWindowProvider();
    expect(provider).toBeUndefined();
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  test('should return undefined if window.ethereum is not present (not empty)', () => {
    // Mock window without ethereum
    windowSpy.mockImplementation(() => ({
      potatoCannon: () => 'potato',
    }));

    const provider = getEthereumWindowProvider();
    expect(provider).toBeUndefined();
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  test('should return undefined if window.ethereum is defined but not valid', () => {
    // Mock window with valid ethereum object
    const mockEthereumProvider = { isMetaMask: true };
    windowSpy.mockImplementation(() => ({
      ethereum: mockEthereumProvider,
    }));

    const provider = getEthereumWindowProvider();
    expect(provider).toBe(undefined);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  test('should return the ethereum provider if it is valid', () => {
    // Mock window with valid ethereum object
    const mockEthereumProvider = {
      request: () => Promise.resolve(),
    };

    expect(isEthereumWindowProvider(mockEthereumProvider)).toBe(true);

    windowSpy.mockImplementation(() => ({
      ethereum: mockEthereumProvider,
    }));

    const provider = getEthereumWindowProvider();
    expect(provider).toBe(mockEthereumProvider);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });
});
