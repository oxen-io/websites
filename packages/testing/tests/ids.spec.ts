import { genericCreateDataTestId, genericIsDataTestId } from '../ids';

// #region - genericCreateDataTestId

describe('genericCreateDataTestId', () => {
  test('should return the correct generic data test ID', () => {
    const baseDataTestId = 'baseTestId';
    const testId = 'testId';
    const expectedDataTestId = `${baseDataTestId}:${testId}`;

    const result = genericCreateDataTestId(baseDataTestId, testId);

    expect(result).toBe(expectedDataTestId);
  });

  test('should throw an error if baseDataTestId is empty', () => {
    const baseDataTestId = '';
    const testId = 'testId';
    const expectedError = new Error('Base data test ID and test ID must not be empty.');

    const result = () => genericCreateDataTestId(baseDataTestId, testId);

    expect(result).toThrow(expectedError);
  });

  test('should throw an error if testId is empty', () => {
    const baseDataTestId = 'baseTestId';
    const testId = '';
    const expectedError = new Error('Base data test ID and test ID must not be empty.');

    const result = () => genericCreateDataTestId(baseDataTestId, testId);

    expect(result).toThrow(expectedError);
  });
});

// #endregion
// #region - genericIsDataTestId

describe('genericIsDataTestId', () => {
  test('should return true for valid data test ID', () => {
    const dataTestId = 'baseTestId:testId';
    const result = genericIsDataTestId(dataTestId);
    expect(result).toBe(true);
  });

  test('should return false for invalid data test ID with missing baseDataTestId', () => {
    const dataTestId = ':testId';
    const result = genericIsDataTestId(dataTestId);
    expect(result).toBe(false);
  });

  test('should return false for invalid data test ID with missing testId', () => {
    const dataTestId = 'baseTestId:';
    const result = genericIsDataTestId(dataTestId);
    expect(result).toBe(false);
  });

  test('should return false for invalid data test ID with extra colon', () => {
    const dataTestId = 'baseTestId:testId:extra';
    const result = genericIsDataTestId(dataTestId);
    expect(result).toBe(false);
  });

  test('should return false for invalid data test ID with empty baseDataTestId', () => {
    const dataTestId = ':testId';
    const result = genericIsDataTestId(dataTestId);
    expect(result).toBe(false);
  });

  test('should return false for invalid data test ID with empty testId', () => {
    const dataTestId = 'baseTestId:';
    const result = genericIsDataTestId(dataTestId);
    expect(result).toBe(false);
  });
});

// #endregion
