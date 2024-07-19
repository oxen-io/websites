/**
 * Collapses a string by replacing characters between the leading and trailing characters with a triple ellipsis unicode character (length 1).
 * The final length of the string will be the sum of the leading and trailing characters plus 1.
 * @param str - The input string to collapse.
 * @param leadingChars - The number of characters to keep at the beginning of the string.
 * @param trailingChars - The number of characters to keep at the end of the string.
 * @returns The collapsed string.
 */
export const collapseString = (str: string, leadingChars = 6, trailingChars = 4): string => {
  if (str.length <= leadingChars + trailingChars + 3) return str;
  return `${str.slice(0, leadingChars)}…${str.slice(-trailingChars)}`;
};

/**
 * Determines the logical equality of two hex values.
 * If either hex starts with `0x` or `0X` this will be omitted in the equality check.
 * Both hexes will be capitalised to determine equality.
 * @param str1 - The first hex.
 * @param str2 - The second hex.
 * @returns If the two hexes are logically equal.
 */
export const areHexesEqual = (str1?: string, str2?: string): boolean => {
  if (!str1 || !str2 || str1.length < 3 || str1.length !== str2.length) return false;
  if (str1 === str2) return true;

  let hex1 = str1.toUpperCase();
  let hex2 = str2.toUpperCase();

  if (hex1.startsWith('0X')) {
    hex1 = hex1.slice(2);
  }

  if (hex2.startsWith('0X')) {
    hex2 = hex2.slice(2);
  }

  return hex1 === hex2;
};
