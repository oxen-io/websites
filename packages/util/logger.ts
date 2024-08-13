import { pino } from 'pino';
import { LOG_LEVEL, SessionLogger, type SessionLoggerOptions } from '@session/logger';
import { isProduction } from './env';

const sessionLoggerOptions: SessionLoggerOptions = {
  globalOptions: {
    constructLoggingArgs: (...data: Array<any>) => {
      return [data.join(' ')];
    },
    ignoredLevels: isProduction() ? [LOG_LEVEL.DEBUG, LOG_LEVEL.INFO] : [],
  },
};

export const initLogger = () => {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  return new SessionLogger(logger, sessionLoggerOptions);
};
