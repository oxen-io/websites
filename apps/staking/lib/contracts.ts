import type { useTranslations } from 'next-intl';
import type { SimulateContractErrorType, TransactionExecutionErrorType } from 'viem';
import type { WriteContractErrorType } from 'wagmi/actions';
import { getContractErrorName } from '@session/contracts';
import { toast } from '@session/ui/lib/toast';
import { GenericContractStatus, WriteContractStatus } from '@session/contracts/hooks/useContractWriteQuery';
import { PROGRESS_STATUS } from '@session/ui/motion/progress';

/**
 * Formats a localized contract error message based on the error type and the dictionary.
 * @param dictionary - The dictionary to use for localization.
 * @param parentDictKey - The parent dictionary key to use for localization. The key used in `useTranslations`
 * @param errorGroupDictKey - The error group dictionary key to use for localization.
 * @param error - The error to format.
 * @returns The formatted error message.
 */
export const formatLocalizedContractErrorMessage = ({
  dictionary,
  parentDictKey,
  errorGroupDictKey,
  error,
}: {
  dictionary: ReturnType<typeof useTranslations>;
  parentDictKey: string;
  errorGroupDictKey: string;
  error: Error | SimulateContractErrorType | WriteContractErrorType | TransactionExecutionErrorType;
}) => {
  const parsedName = getContractErrorName(error);
  const dictKey = `${errorGroupDictKey}.errors.${parsedName}`;
  /** @ts-expect-error -- We handle the invalid key case in the if statement below */
  let reason = dictionary(dictKey);
  if (reason === `${parentDictKey}.${dictKey}`) reason = parsedName;
  /** @ts-expect-error -- This key should exist, but this logs an error and returns the key if it doesn't */
  return dictionary(`${errorGroupDictKey}.errorTemplate`, { reason });
};

/**
 * Formats a localized contract error messages based on the error types and the dictionary. This issued for all contract errors from a single contract lifecycle.
 * @param dictionary - The dictionary to use for localization.
 * @param parentDictKey - The parent dictionary key to use for localization. The key used in `useTranslations`
 * @param errorGroupDictKey - The error group dictionary key to use for localization.
 * @param error - The error to format.
 * @returns The formatted error message.
 */
export const formatAndHandleLocalizedContractErrorMessages = ({
  dictionary,
  dictionaryGeneral,
  parentDictKey,
  errorGroupDictKey,
  simulateError,
  writeError,
  transactionError,
}: {
  dictionary: ReturnType<typeof useTranslations>;
  dictionaryGeneral: ReturnType<typeof useTranslations>;
  parentDictKey: string;
  errorGroupDictKey: string;
  simulateError?: SimulateContractErrorType | Error | null;
  writeError?: WriteContractErrorType | Error | null;
  transactionError?: TransactionExecutionErrorType | Error | null;
}) => {
  if (simulateError) {
    toast.handleError(simulateError);
    return formatLocalizedContractErrorMessage({
      dictionary,
      parentDictKey,
      errorGroupDictKey,
      error: simulateError,
    });
  } else if (writeError) {
    toast.handleError(writeError);
    return formatLocalizedContractErrorMessage({
      dictionary,
      parentDictKey,
      errorGroupDictKey,
      error: writeError,
    });
  } else if (transactionError) {
    toast.handleError(transactionError);
    return formatLocalizedContractErrorMessage({
      dictionary,
      parentDictKey,
      errorGroupDictKey,
      error: transactionError,
    });
  }
  return dictionaryGeneral('unknownError');
};

/**
 * Parses the contract status to a progress status.
 * @param contractStatus - The contract status to parse.
 * @returns The progress status.
 * {@link PROGRESS_STATUS}
 */
export const parseContractStatusToProgressStatus = (
  contractStatus: GenericContractStatus | WriteContractStatus
) => {
  switch (contractStatus) {
    case 'error':
      return PROGRESS_STATUS.ERROR;

    case 'pending':
      return PROGRESS_STATUS.PENDING;

    case 'success':
      return PROGRESS_STATUS.SUCCESS;

    default:
      return PROGRESS_STATUS.IDLE;
  }
};
