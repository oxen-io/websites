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
