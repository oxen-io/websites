import { formatUnits, parseUnits } from 'viem';
import { SENT_DECIMALS } from './constants';

export function formatSENT(value: bigint): string {
  return formatUnits(value, SENT_DECIMALS);
}

export function parseSENT(value: string): bigint {
  return parseUnits(value, SENT_DECIMALS);
}
