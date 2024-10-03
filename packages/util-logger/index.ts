/* eslint-disable @typescript-eslint/no-explicit-any */

import { pino } from 'pino';
import { LOG_LEVEL, SessionLogger, type SessionLoggerOptions } from '@session/logger';
import { isProduction } from '@session/util-js/env';

export function constructLoggingArgs(...data: Array<any>) {
  return [data.join(' ')];
}

const createSessionLoggerOptions = ({
  isProd = isProduction(),
}: {
  isProd?: boolean;
}): SessionLoggerOptions => ({
  globalOptions: {
    constructLoggingArgs,
    ignoredLevels: isProd ? [LOG_LEVEL.DEBUG, LOG_LEVEL.INFO] : [],
  },
});

type InitLoggerOptions = {
  isProduction?: boolean;
};

export const initLogger = (options?: InitLoggerOptions) => {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  return new SessionLogger(logger, createSessionLoggerOptions({ isProd: options?.isProduction }));
};
