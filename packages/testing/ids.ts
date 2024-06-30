export type DataTestIdTag = string;
export type GenericDataTestId<BaseDataTestId extends string> = `${BaseDataTestId}:${DataTestIdTag}`;

/**
 * Creates a generic data test ID by combining a base data test ID and a test ID.
 * @param baseDataTestId The base data test ID.
 * @param testId The test ID.
 * @returns The generic data test ID.
 */
export function genericCreateDataTestId<BaseDataTestId extends string>(
  baseDataTestId: BaseDataTestId,
  testId: string
): GenericDataTestId<BaseDataTestId> {
  if (baseDataTestId === '' || testId === '') {
    throw new Error('Base data test ID and test ID must not be empty.');
  }
  return `${baseDataTestId}:${testId}` as GenericDataTestId<BaseDataTestId>;
}

/**
 * Checks if a given string is a valid data test ID.
 * @param dataTestId The string to be checked.
 * @returns A boolean indicating whether the string is a valid data test ID.
 */
export function genericIsDataTestId<BaseDataTestId extends string>(
  dataTestId: string
): dataTestId is GenericDataTestId<BaseDataTestId> {
  const splitId = dataTestId.split(':');
  if (splitId.length !== 2 || splitId[0]?.length === 0 || splitId[1]?.length === 0) {
    return false;
  }
  return true;
}
