import { collapseString } from '../string';

// #region - collapseString

describe('collapseString', () => {
  test('should collapse the string with default leading and trailing characters', () => {
    const str = 'This is a long string that needs to be collapsed';
    const collapsed = collapseString(str);
    expect(collapsed).toBe('This i…psed');
  });

  test('should collapse the string with custom leading and trailing characters', () => {
    const str = 'This is a long string that needs to be collapsed';
    const collapsed = collapseString(str, 10, 8);
    expect(collapsed).toBe('This is a …ollapsed');
  });

  test('should not collapse the string if it is already short', () => {
    const str = 'Short string';
    const collapsed = collapseString(str);
    expect(collapsed).toBe(str);
  });

  test('should return an empty string if the input string is empty', () => {
    const collapsed = collapseString('');
    expect(collapsed).toBe('');
  });

  test('should return an the whole string if the input string is shorter than the leading and trailing characters', () => {
    const collapsed = collapseString('Short', 10, 8);
    expect(collapsed).toBe('Short');
  });
});
