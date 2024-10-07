import { safeTrySync } from '@session/util-js/try';
import { draftMode } from 'next/headers';
import logger from './logger';
import { isProduction } from '@session/util-js/env';

/**
 * Checks if draft mode is enabled.
 *
 * @link https://nextjs.org/docs/app/api-reference/functions/draft-mode#checking-if-draft-mode-is-enabled
 *
 * @returns If draft mode is enabled
 */
export const isDraftModeEnabled = () => {
  const [err, result] = safeTrySync(draftMode);

  if (err) {
    /**
     * If the error is a "called outside a request scope" error, it means the function was called
     * outside a request scope, so we can draft mode is not enabled. This happens when cms calls are
     * made during SSR.
     */
    if ('message' in err && err.message.includes('called outside a request scope')) {
      return false;
    }

    logger.error(`Error getting draft mode`);

    if (isProduction()) {
      logger.error(err);
      return false;
    }

    throw err;
  }

  return result.isEnabled;
};
