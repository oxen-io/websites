import { safeTrySync } from '@session/util-js/try';
import { draftMode } from 'next/headers';
import logger from './logger';

/**
 * Checks if draft mode is enabled.
 *
 * @link https://nextjs.org/docs/app/api-reference/functions/draft-mode#checking-if-draft-mode-is-enabled
 *
 * @param isClient - If the function is being called from the client
 * @returns If draft mode is enabled
 */
export const isDraftModeEnabled = (isClient = false) => {
  if (isClient) return false;

  const [error, result] = safeTrySync(draftMode);

  if (error) {
    logger.error(`Error getting draft mode`, error);
    return false;
  }

  return result.isEnabled;
};
