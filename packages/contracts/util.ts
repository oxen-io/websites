import { formatUnits, parseUnits } from 'viem';
import { SENT_DECIMALS } from './constants';

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
