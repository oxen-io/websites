import { LOG_LEVEL, type Logger } from './logger';

/**
 * Create a new TimedLog instance. A logging method can be called later to log a message with an elapsed time.
 *
 * When an instance of this class is created it will save the current time in itself and use that time to compute the elapsed time when a logging method is called on it.
 *
 * @example
 * const timedLog = new TimedLog();
 * timedLog.debug('A message was sent with id 7');
 * // Output: A message was sent with id 7: 1.923s
 *
 * @example
 * const timedLog = new TimedLog();
 * timedLog.debug('A message was sent after {time} with id 7');
 * // Output: A message was sent after 1.923s with id 7
 */
export class TimedLog {
  private start: number = Date.now();
  private readonly logger: Logger;

  private static timeAppendPrefix = ':';
  private static millisecondSuffix = 'ms';
  private static secondSuffix = 's';

  constructor(logger: Logger, initialLogMessage?: string, initialLogMessageLevel?: keyof Logger) {
    this.logger = logger;

    if (initialLogMessage) {
      this.log(initialLogMessageLevel ?? LOG_LEVEL.DEBUG, initialLogMessage);
    }
  }

  /**
   * Reset the timer to the current time.
   *
   * @example
   * const timedLog = new TimedLog();
   * timedLog.debug('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   * timedLog.resetTimer();
   * timedLog.debug('A message was sent with id 8');
   * // Output: A message was sent with id 8: 2.318s
   */
  public resetTimer() {
    this.start = Date.now();
  }

  /**
   * The timed log's current elapsed time.
   */
  public get elapsedTime() {
    return Date.now() - Math.floor(this.start);
  }

  /**
   * Format the time elapsed since the start of the timer.
   * @param time The time to format.
   * @returns The formatted time.
   */
  public static formatDistanceToNow(time: number) {
    const ms = Date.now() - Math.floor(time);
    const s = Math.floor(ms / 1000);
    if (s === 0) {
      return `${ms}${TimedLog.millisecondSuffix}`;
    }

    if (ms === 0) {
      return `${s}${TimedLog.secondSuffix}`;
    }

    function formatMillisecondsToSeconds(milliseconds: number): string {
      const seconds = milliseconds / 1000;
      return seconds.toFixed(3).replace(/\.?0+$/, '');
    }

    return `${formatMillisecondsToSeconds(ms)}${TimedLog.secondSuffix}`;
  }

  /**
   * Format a message with the time elapsed since the start of the timer.
   * If the message contains a placeholder {*}, the placeholder will be replaced with the time passed.
   * Otherwise, the time passed will be added to the end of the message, separated by a separator or ': ' by default.
   *
   * @param data The message to replace the time in.
   * @returns The message with the time replaced.
   */
  private writeTimeToLog(...data: Array<any>) {
    const time = TimedLog.formatDistanceToNow(this.start);

    const includesTemplate = data.some((arg) => typeof arg === 'string' && /\{.*\}/.test(arg));

    if (!includesTemplate) {
      return [...data, TimedLog.timeAppendPrefix, time];
    }

    return data.map((arg) =>
      typeof arg === 'string' && /\{.*\}/.test(arg) ? arg.replace(/\{.*\}/g, time) : arg
    );
  }

  /**
   * Log a message at the given level.
   *
   * @param level The level to log at.
   * @param data The message to log.
   */
  private log(level: LOG_LEVEL, ...data: Array<any>): void {
    this.logger[level](...this.writeTimeToLog(...data));
  }

  /**
   * Log a message at the debug level with the elapsed time.
   *
   * If the message contains a placeholder {*}, the placeholder will be replaced with the time passed.
   * Otherwise, the time passed will be added to the end of the message.
   *
   * @param data The message to log at the debug level.
   *
   * @see {@link initTimedLog} to create a new TimedLog instance.
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.debug('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.debug('A message was sent after {time} with id 7');
   * // Output: A message was sent after 1.923s with id 7
   */
  public debug(...data: Array<any>) {
    return this.log(LOG_LEVEL.DEBUG, ...data);
  }

  /**
   * Log a message at the info level with the elapsed time.
   *
   * If the message contains a placeholder {*}, the placeholder will be replaced with the time passed.
   * Otherwise, the time passed will be added to the end of the message.
   *
   * @param data The message to log at the info level.
   *
   * @see {@link initTimedLog} to create a new TimedLog instance.
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.info('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.info('A message was sent after {time} with id 7');
   * // Output: A message was sent after 1.923s with id 7
   */
  public info(...data: Array<any>) {
    return this.log(LOG_LEVEL.INFO, ...data);
  }

  /**
   * Log a message at the warn level with the elapsed time.
   *
   * If the message contains a placeholder {*}, the placeholder will be replaced with the time passed.
   * Otherwise, the time passed will be added to the end of the message.
   *
   * @param data The message to log at the warn level.
   *
   * @see {@link initTimedLog} to create a new TimedLog instance.
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.warn('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.warn('A message was sent after {time} with id 7');
   * // Output: A message was sent after 1.923s with id 7
   */
  public warn(...data: Array<any>) {
    return this.log(LOG_LEVEL.WARN, ...data);
  }

  /**
   * Log a message at the error level with the elapsed time.
   *
   * If the message contains a placeholder {*}, the placeholder will be replaced with the time passed.
   * Otherwise, the time passed will be added to the end of the message.
   *
   * @param data The message to log at the error level.
   *
   * @see {@link initTimedLog} to create a new TimedLog instance.
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.error('A message was sent with id 7');
   * // Output: A message was sent with id 7: 1.923s
   *
   * @example
   * const timedLog = initTimedLog();
   * timedLog.error('A message was sent after {time} with id 7');
   * // Output: A message was sent after 1.923s with id 7
   */
  public error(...data: Array<any>) {
    return this.log(LOG_LEVEL.ERROR, ...data);
  }
}

/**
 * Create a new TimedLog instance. This can be called later to log a message with an elapsed time.
 * @param logger A Logger
 *
 * @returns A new TimedLog instance.
 *
 * @see {@link TimedLog} for more information on how to use the returned instance.
 *
 * @example
 * const timedLog = TimedLog();
 * timedLog.debug('A message was sent with id 7');
 * // Output: A message was sent with id 7: 1.923s
 *
 * @example
 * const timedLog = TimedLog();
 * timedLog.info('A message was sent after {time} with id 7');
 * // Output: A message was sent after 1.923s with id 7
 */
export const initTimedLog = (logger: Logger) => {
  return new TimedLog(logger);
};
/**
 * Create a new TimedLog instance. This can be called later to log a message with an elapsed time.
 * @param logger A logger
 * @param initialLogMessage The message to log when the instance is created.
 * @param initialLogMessageLevel The level to log the initial message at.
 * @returns A new TimedLog instance.
 *
 * @see {@link TimedLog} for more information on how to use the returned instance.
 *
 * @example
 * const timedLog = initTimedLogWithInitialLog(console.log, 'A message is being sent with id 7');
 * // Output: A message is being sent with id 7
 * timedLog.debug('A message was sent with id 7');
 * // Output: A message was sent with id 7: 1.923s
 *
 * @example
 * const timedLog = initTimedLogWithInitialLog(console.log, 'A message is being sent with id 7', 'info');
 * // Output: A message is being sent with id 7
 * timedLog.info('A message was sent after {time} with id 7');
 * // Output: A message was sent after 1.923s with id 7
 */
export const initTimedLogWithInitialLog = (
  logger: Logger,
  initialLogMessage: string,
  initialLogMessageLevel: keyof Logger = LOG_LEVEL.DEBUG
) => {
  return new TimedLog(logger, initialLogMessage, initialLogMessageLevel);
};
