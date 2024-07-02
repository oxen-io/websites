/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - The number of decimal places to round to. Default is 4.
 * @returns The rounded number.
 */
export const roundNumber = (value: number, decimals = 4): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Formats a number as a string with a specified number of decimal places.
 * If the value is not a finite number, it returns the value as a string.
 *
 * @param value - The value to format.
 * @param decimals - The number of decimal places to include in the formatted value. Default is 4.
 * @returns The formatted value as a string.
 */
export const formatNumber = (value: number, decimals = 4): string => {
  if (!Number.isFinite(value)) {
    return value.toString();
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Converts a BigInt value to a number with the specified number of decimals.
 * @param value - The BigInt value to convert.
 * @param decimals - The number of decimals to include in the converted number.
 * @returns The converted number.
 * @throws {RangeError} If the converted number is outside the safe JavaScript range.
 */
export const bigIntToNumber = (value: bigint, decimals: number): number => {
  if (decimals === 0) return Number(value);

  let str = value.toString();

  const isNegative = str.startsWith('-');
  if (isNegative) {
    str = str.slice(1);
  }

  if (str.length <= decimals) {
    str = ['0', str.padStart(decimals, '0')].join('.');
  } else {
    str = [str.slice(0, -decimals), str.slice(-decimals)].join('.');
  }

  const floatValueWithDecimals = parseFloat(`${isNegative ? '-' : ''}${str}`);

  if (
    floatValueWithDecimals > Number.MAX_SAFE_INTEGER ||
    floatValueWithDecimals < Number.MIN_SAFE_INTEGER
  ) {
    throw new RangeError('Value is outside the safe JavaScript range');
  }

  return floatValueWithDecimals;
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
  const number = bigIntToNumber(value, decimalValue);
  return formatNumber(number, decimals);
};
