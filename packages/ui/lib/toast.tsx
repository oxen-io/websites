import { type ExternalToast, toast as sonnerToast } from 'sonner';
import { collapseString } from '@session/util-crypto/string';
import { CopyToClipboardButton } from '../components/CopyToClipboardButton';
import { ButtonDataTestId } from '../data-test-ids';
import React from 'react';

type Toast = typeof sonnerToast & {
  handleError: (error: Error, data?: ExternalToast) => void;
};

/**
 * Handles errors by displaying them in a toast in a collapsed form with a copy button for the full error. This will also log the error to the console.
 * @param error The error to handle
 * @param data The data to pass to the toast
 */
function handleError(error: Error, data?: ExternalToast) {
  console.error(error);
  const errorMessage = error.message ?? 'An unknown error occurred';
  sonnerToast.error(
    <div className="flex gap-2 align-middle">
      {collapseString(error.message, 128, 128)}
      <CopyToClipboardButton
        textToCopy={errorMessage}
        data-testid={ButtonDataTestId.Copy_Error_To_Clipboard}
      />
    </div>,
    data
  );
}

export const toast = {
  ...sonnerToast,
  handleError,
} as Toast;
