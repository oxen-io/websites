import { formatUnits, parseUnits, type SimulateContractErrorType, type TransactionExecutionErrorType } from 'viem';
import { SENT_DECIMALS } from './constants';
import type { WriteContractErrorType } from 'wagmi/actions';

/**
 * Formats a value of type `bigint` as a string, using the {@link formatUnits} function and the {@link SENT_DECIMALS} constant.
 * @deprecated - Use {@link formatSENTBigInt} instead.
 * @param value - The value to be formatted.
 * @returns The formatted value as a string.
 */
export function formatSENT(value: bigint): string {
  return formatUnits(value, SENT_DECIMALS);
}

/**
 * Parses a string value into a `bigint` representing SENT. Uses the {@link parseUnits} function and the {@link SENT_DECIMALS} constant.
 * @param value - The string value to parse.
 * @returns A `bigint` representing SENT.
 */
export function parseSENT(value: string): bigint {
  return parseUnits(value, SENT_DECIMALS);
}

/**
 * Get a smart contract error name from a wagmi error.
 * @param error - The error to get the name from.
 * @returns The error name.
 */
export function getContractErrorName(
  error: Error | SimulateContractErrorType | WriteContractErrorType | TransactionExecutionErrorType
) {
  let reason = error.name;

  if (error?.cause && typeof error.cause === 'object') {
    if (
      'data' in error.cause &&
      error.cause.data &&
      typeof error.cause.data === 'object' &&
      'abiItem' in error.cause.data &&
      error.cause.data.abiItem &&
      typeof error.cause.data.abiItem === 'object' &&
      'name' in error.cause.data.abiItem &&
      typeof error.cause.data.abiItem.name === 'string'
    ) {
      reason = error.cause.data.abiItem.name;
    } else if (
      'cause' in error.cause &&
      typeof error.cause.cause === 'object' &&
      error.cause.cause &&
      'name' in error.cause.cause &&
      typeof error.cause.cause.name === 'string'
    ) {
      reason = error.cause.cause.name;
    }
  }

  return reason.endsWith('Error') ? reason.slice(0, -5) : reason;
}
