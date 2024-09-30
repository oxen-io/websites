import { constructLoggingArgs, initLogger } from '../index';
import { getPrivateClassProperty } from '@session/testing/util';
import { LOG_LEVEL } from '@session/logger';

const testLogger = initLogger({ isProduction: false });
let mockConsoleDebug: jest.SpyInstance;
let mockConsoleInfo: jest.SpyInstance;
let mockConsoleWarn: jest.SpyInstance;
let mockConsoleError: jest.SpyInstance;

beforeEach(() => {
  mockConsoleDebug = jest.spyOn(testLogger, 'debug').mockImplementation(() => {});
  mockConsoleInfo = jest.spyOn(testLogger, 'info').mockImplementation(() => {});
  mockConsoleWarn = jest.spyOn(testLogger, 'warn').mockImplementation(() => {});
  mockConsoleError = jest.spyOn(testLogger, 'error').mockImplementation(() => {});
});

describe('util-logger', () => {
  it('should initialize logger', () => {
    const logger = initLogger();
    expect(logger).toBeDefined();
  });

  it('should initialize logger by default with correct level', () => {
    const logger = initLogger();
    const ignoredLevels = getPrivateClassProperty(logger, 'ignoredLevels');
    expect(ignoredLevels).toStrictEqual([]);
  });

  it('should initialize logger in production with correct level', () => {
    const logger = initLogger({ isProduction: true });
    const ignoredLevels = getPrivateClassProperty(logger, 'ignoredLevels');
    expect(ignoredLevels).toStrictEqual([LOG_LEVEL.DEBUG, LOG_LEVEL.INFO]);
  });

  it('should initialize logger in development with correct level', () => {
    const logger = initLogger({ isProduction: false });
    const ignoredLevels = getPrivateClassProperty(logger, 'ignoredLevels');
    expect(ignoredLevels).toStrictEqual([]);
  });

  it('should log at debug level', () => {
    testLogger.debug('debug');
    expect(mockConsoleDebug).toHaveBeenCalled();
  });

  it('should log at info level', () => {
    testLogger.info('info');
    expect(mockConsoleInfo).toHaveBeenCalled();
  });

  it('should log at warn level', () => {
    testLogger.warn('warn');
    expect(mockConsoleWarn).toHaveBeenCalled();
  });

  it('should log at error level', () => {
    testLogger.error('error');
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('should init and log', () => {
    const logger = initLogger();
    logger.initTimedLog();
    expect(mockConsoleDebug).toHaveBeenCalled();
  });
});

describe('constructLoggingArgs', () => {
  it('should return correct args', () => {
    const args = constructLoggingArgs('test');
    expect(args).toStrictEqual(['test']);
  });

  it('should return correct args with multiple args', () => {
    const args = constructLoggingArgs('test', 'test2');
    expect(args).toStrictEqual(['test test2']);
  });
});
