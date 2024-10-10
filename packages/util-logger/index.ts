/* eslint-disable @typescript-eslint/no-explicit-any */

import { pino } from 'pino';

// TODO: look into redoing the logger

// TODO: change this to use the json logger properly
export function constructLoggingArgs(...data: Array<any>) {
  if (data && typeof data[0] === 'object') {
    return data[0];
  }
  return [data?.join(' ')];
}

//
// const createSessionLoggerOptions = ({
//   isProd = isProduction(),
// }: {
//   isProd?: boolean;
// }): SessionLoggerOptions => ({
//   globalOptions: {
//     constructLoggingArgs,
//     ignoredLevels: isProd ? [LOG_LEVEL.DEBUG, LOG_LEVEL.INFO] : [],
//   },
// });

// type InitLoggerOptions = {
//   isProduction?: boolean;
// };

// export const initLogger = (options?: InitLoggerOptions) => {
export const initLogger = () => {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  // return new SessionLogger(logger, createSessionLoggerOptions({ isProd: options?.isProduction }));
  return logger;
};

export const logger = initLogger();
