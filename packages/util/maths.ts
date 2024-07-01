/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - The number of decimal places to round to. Default is 4.
 * @returns The rounded number.
 */
export const roundTokenValue = (value: number, decimals = 4): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Formats a token value as a string with a specified number of decimal places.
 * If the value is not a finite number, it returns the value as a string.
 *
 * @param value - The token value to format.
 * @param decimals - The number of decimal places to include in the formatted value. Default is 4.
 * @returns The formatted token value as a string.
 */
export const formatTokenValue = (value: number, decimals = 4): string => {
  if (!Number.isFinite(value)) {
    return value.toString();
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formats a bigint token value as a string with a specified number of decimal places.
 * If the value is not a finite number, it returns the value as a string.
 *
 * @param value - The bigint token value to format.
 * @param decimalValue - The decimal value of the bigint token.
 * @param decimals - The number of decimal places to include in the formatted value. Default is 4.
 * @returns The formatted token value as a string.
 */
export const formatBigIntTokenValue = (
  value: bigint,
  decimalValue: number,
  decimals = 4
): string => {
  const floatValue = parseFloat(value.toString());

  if (floatValue > Number.MAX_SAFE_INTEGER || floatValue < Number.MIN_SAFE_INTEGER) {
    throw new RangeError('Value is outside the safe JavaScript range');
  }

  const decimalMultiplier = Math.pow(10, decimalValue);

  // divide by the decimal multiplier to get the correct float value
  const floatValueWithDecimals = floatValue / decimalMultiplier;

  return formatTokenValue(floatValueWithDecimals, decimals);
};
