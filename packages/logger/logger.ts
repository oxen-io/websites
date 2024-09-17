/* eslint-disable @typescript-eslint/no-explicit-any */

import { TimedLog, type InitialLog } from './timedLog';

export enum LOG_LEVEL {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export type Logger = Record<LOG_LEVEL, LogFunction>;
export type LogFunction = (...args: Array<any>) => any;

export type LogCallbackFunction = (...args: Array<any>) => any;

type LogCallbackOptions = {
  callbackFunctionBeforeLogging?: LogCallbackFunction;
  callbackFunctionAfterLogging?: LogCallbackFunction;
  constructLoggingArgs?: (...data: Array<any>) => any;
};

type LogDebugOptions = {
  warnAboutStaleTimedLogs?: boolean;
};

type LogGlobalOptions<Level extends string> = LogCallbackOptions & {
  ignoredLevels?: Array<Level>;
  maxActiveTimedLogs?: number;
  debugOptions?: LogDebugOptions;
};

type LogLevelOptions<Level extends string> = Partial<Record<Level, LogCallbackOptions>>;

type CustomLevelOptions<Level extends string> = {
  levelOptions?: LogLevelOptions<Level>;
  ignoredLevels?: Array<Level>;
};

type TimedLogOptions = {
  timeUntilLogIsStale?: number;
  cleanupStaleTimedLogs?: boolean;
};

export type SessionLoggerOptions = {
  globalOptions?: LogGlobalOptions<LOG_LEVEL> & LogCallbackOptions;
  timedLogOptions?: TimedLogOptions;
  levelOptions?: LogLevelOptions<LOG_LEVEL>;
  customLevels?: CustomLevelOptions<string>;
};

export class SessionLogger {
  private readonly logger: Logger;
  private readonly globalOptions?: SessionLoggerOptions['globalOptions'];
  private readonly levelOptions?: LogLevelOptions<string>;
  private readonly timedLogOptions?: TimedLogOptions;
  private readonly ignoredLevels?: Array<string> = [];

  private readonly constructLoggingArgs: (...args: Array<any>) => any = (...args: Array<any>) =>
    args;

  private activeTimedLogs: Map<string, TimedLog> = new Map();
  private readonly maxActiveTimedLogs: number = 500;

  constructor(logger: Logger, loggerOptions?: SessionLoggerOptions) {
    this.logger = logger;

    if (loggerOptions?.globalOptions?.constructLoggingArgs) {
      this.constructLoggingArgs = loggerOptions?.globalOptions?.constructLoggingArgs;
    }

    if (loggerOptions) {
      const { globalOptions, levelOptions, customLevels, timedLogOptions } = loggerOptions;

      this.ignoredLevels = loggerOptions.globalOptions?.ignoredLevels;
      this.globalOptions = globalOptions;
      this.timedLogOptions = timedLogOptions;

      if (globalOptions?.maxActiveTimedLogs !== undefined) {
        this.maxActiveTimedLogs = globalOptions.maxActiveTimedLogs;
      }

      if (customLevels) {
        this.levelOptions = {
          ...levelOptions,
          ...customLevels.levelOptions,
        };
        this.ignoredLevels?.concat(customLevels.ignoredLevels ?? []);
      } else {
        this.levelOptions = levelOptions;
      }
    }
  }

  /**
   * Log a message at the given level.
   *
   * @param level The level to log at.
   * @param data The message to log.
   */
  private log(level: LOG_LEVEL, ...data: Array<any>): void {
    if (this.ignoredLevels?.includes(level)) return;
    this.globalOptions?.callbackFunctionBeforeLogging?.();

    this.levelOptions?.[level]?.callbackFunctionBeforeLogging?.();

    this.logger[level](...this.constructLoggingArgs(...data));
    this.levelOptions?.[level]?.callbackFunctionBeforeLogging?.();

    this.globalOptions?.callbackFunctionAfterLogging?.();
  }

  /**
   * Log a message at the debug level with the elapsed time.
   * @param data The message to log at the debug level.
   */
  public debug(...data: Array<any>) {
    return this.log(LOG_LEVEL.DEBUG, ...data);
  }

  /**
   * Log a message at the info level with the elapsed time.
   * @param data The message to log at the info level.
   */
  public info(...data: Array<any>) {
    return this.log(LOG_LEVEL.INFO, ...data);
  }

  /**
   * Log a message at the warn level with the elapsed time.
   * @param data The message to log at the warn level.
   */
  public warn(...data: Array<any>) {
    return this.log(LOG_LEVEL.WARN, ...data);
  }

  /**
   * Log a message at the error level.
   * @param data The message to log at the error level.
   */
  public error(...data: Array<any>) {
    return this.log(LOG_LEVEL.ERROR, ...data);
  }

  /**
   * Create a new {@link TimedLog} instance. This can be called later to log a message with an elapsed time.
   *
   * @param options Options for using timed log storage inside the logger instance. Using {@link activeTimedLogs}.
   * @param options.saveTimedLogInstanceInLogger Set to true to save the {@link TimedLog} instance inside the logger.
   * @param options.uniqueId The unique id the {@link TimedLog} instance will be saved under.
   * @param options.initialLog Send an initial log message.
   * @param options.initialLog.message The message to log when the instance is created.
   * @param options.initialLog.level The level to log the initial message at.
   *
   * @returns A new TimedLog instance.
   *
   * @see {@link getTimedLog} to retrieve the timed log.
   * @see {@link TimedLog} for more information on how to use the returned instance.
   *
   * @example Basic Usage
   * const timedLog = logger.initTimedLog();
   * timedLog.debug('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   *
   * @example Template String
   * const timedLog = logger.initTimedLog();
   * timedLog.info('A message was sent after {time} with id 7');
   * // Output: A message was sent after 1.923s with id 7
   *
   * @example Saving the Timed Log
   * logger.initTimedLog({ saveTimedLogInstanceInLogger: true, uniqueId: 'abc123' });
   * // ...
   * const timedLog = logger.getTimedLog('abc123');
   * timedLog.debug('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   *
   * @example Basic Usage - Initial Log
   * const timedLog = logger.initTimedLog('A message is being sent with id 7');
   * // Output: A message is being sent with id 7
   * timedLog.debug('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   *
   * @example Template String - Initial Log
   * const timedLog = logger.initTimedLog('A message is being sent with id 7', 'info');
   * // Output: A message is being sent with id 7
   * timedLog.info('A message was sent after {time} with id 7');
   * // Output: A message was sent after 1.923s with id 7
   *
   * @example Saving the Timed Log - Initial Log
   * logger.initTimedLog('A message is being sent with id 7', 'info', { saveTimedLogInstanceInLogger: true, uniqueId: 'abc123' });
   * // Output: A message is being sent with id 7
   * // ...
   * const timedLog = logger.getTimedLog('abc123');
   * timedLog.info('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   */
  public initTimedLog(options?: {
    saveTimedLogInstanceInLogger: boolean;
    uniqueId: string;
    initialLog?: InitialLog;
  }) {
    const timedLog = new TimedLog(this, options?.initialLog);

    if (options?.saveTimedLogInstanceInLogger) {
      this.saveTimedLog(options.uniqueId, timedLog);
    }

    return timedLog;
  }

  /**
   * Save a {@link TimedLog} to the logger.
   * @param uniqueId The unique id to save the {@link TimedLog} as.
   * @param timedLog The {@link TimedLog} instance to save.
   *
   * @deprecated This is a helper method for {@link time}, which is deprecated.
   * Use {@link initTimedLog} for proper timed logs using {@link TimedLog}
   *
   */
  private saveTimedLog(uniqueId: string, timedLog: TimedLog) {
    if (this.activeTimedLogs.has(uniqueId)) {
      this.logger.warn(
        `Creating a new timed log with the same label as an existing timed log would cause the existing log event to be written over. The first call of timeEnd with the same label will consume this single event leaving no event for a second timeEnd to consume. Ensure all active timed log events are properly labeled or use initTimedLog to properly manage timed logs. Unique Id: ${uniqueId}`
      );
      return;
    }

    this.activeTimedLogs.set(uniqueId, timedLog);
  }

  /**
   * Get a saved {@link TimedLog} instance.
   * @param uniqueId The unique id of the {@link TimedLog} instance.
   *
   * @deprecated This is a helper method for {@link time}, which is deprecated.
   * Use {@link initTimedLog} for proper timed logs using {@link TimedLog}
   *
   */
  public getTimedLog(uniqueId: string) {
    return this.activeTimedLogs.get(uniqueId);
  }

  /**
   * Replacement method for {@link console.time} which starts a timed log.
   * @deprecated use {@link initTimedLog} for proper timed logs using {@link TimedLog}
   *
   * @param label Unique identifier for the {@link TimedLog}
   */
  public time(label: string = 'default'): void {
    if (
      this.timedLogOptions?.cleanupStaleTimedLogs ||
      this.globalOptions?.debugOptions?.warnAboutStaleTimedLogs
    ) {
      this.handleStaleTimedLogs();
    }

    if (this.activeTimedLogs.size >= this.maxActiveTimedLogs) {
      this.logger.warn(
        `Creating a new timed log would exceed the set limit (${this.maxActiveTimedLogs}). Ignoring new timed log: ${label}`
      );
      return;
    }

    const timedLog = this.initTimedLog();

    if (this.activeTimedLogs.has(label)) {
      this.logger.warn(
        `Creating a new timed log with the same label as an existing timed log would cause the existing log event to be written over. The first call of timeEnd with the same label will consume this single event leaving no event for a second timeEnd to consume. Ensure all active timed log events are properly labeled or use initTimedLog to properly manage timed logs. Label: ${label}`
      );
      return;
    }

    this.saveTimedLog(label, timedLog);
  }

  /**
   * Replacement method for {@link console.timeEnd} which ends a timed log.
   * @deprecated use {@link initTimedLog} for proper timed logs using {@link TimedLog}
   *
   * @param label Unique identifier for the timed log
   */
  public timeEnd(label: string = 'default'): void {
    if (
      this.timedLogOptions?.cleanupStaleTimedLogs ||
      this.globalOptions?.debugOptions?.warnAboutStaleTimedLogs
    ) {
      this.handleStaleTimedLogs();
    }

    const timedLog = this.activeTimedLogs.get(label);

    if (timedLog) {
      timedLog?.info(label);
      this.activeTimedLogs.delete(label);
    } else {
      this.warn(`Logger attempted to end a timed log before it was initialized: ${label}`);
    }
  }

  /**
   * Determine if a timed log is stale.
   * The staleTime is the time in milliseconds after the timed log is considered stale.
   * When the timed log will be removed if accessed or a cleanup method is invoked.
   * @param timedLog The {@link TimedLog} instance
   */
  private isTimedLogStale(timedLog: TimedLog) {
    const staleTime = this.timedLogOptions?.timeUntilLogIsStale ?? Infinity;
    const logTime = timedLog.elapsedTime;

    return logTime > staleTime;
  }

  /**
   * Handles a timed logs stale behaviour.
   * If {@link warnAboutStaleTimedLogs} is set to true a warning will be logged.
   * If {@link cleanupStaleTimedLogs} is set to true the log will be removed from the {@link activeTimedLogs} Map.
   *
   * @param label The log label to handle the stale behaviour for.
   */
  private handleStaleTimedLog(label: string) {
    if (this.globalOptions?.debugOptions?.warnAboutStaleTimedLogs) {
      this.warn(
        `Timed log is stale. Set globalOptions.debugOptions.warnAboutStaleTimedLogs to false to disable these warnings. Label: ${label}.`
      );
    }

    if (this.timedLogOptions?.cleanupStaleTimedLogs && this.activeTimedLogs.has(label)) {
      this.activeTimedLogs.delete(label);
    }
  }

  /**
   * Handle stale log checking for all logs in {@link activeTimedLogs}.
   * This calls {@link handleStaleTimedLog} on each stale log.
   */
  private handleStaleTimedLogs() {
    for (const [label, log] of this.activeTimedLogs.entries()) {
      if (this.isTimedLogStale(log)) {
        this.handleStaleTimedLog(label);
      }
    }
  }
}
