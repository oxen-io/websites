/**
 * Collapses a string by replacing characters between a specified length with an ellipsis.
 * The final length of the string will be the {sideLength} * 2 + 3.
 * @param str - The input string to collapse.
 * @param sideLength - The number of characters to keep on either side of the string. Default is 4.
 * @returns The collapsed string.
 */
export const collapseString = (str: string, sideLength = 4): string => {
  if (str.length <= sideLength * 2 + 3) return str;
  return `${str.slice(0, sideLength)}...${str.slice(-sideLength)}`;
};
