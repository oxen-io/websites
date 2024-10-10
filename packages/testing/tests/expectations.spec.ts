import { expectFunctionToCatchErrors, getThrownError } from '../expectations';

const testError = new Error('foo');

describe('getThrownError', () => {
  it('should fail an expectation if the given function does not catch its error', async () => {
    expect.assertions(1);

    const testFunc = () => {
      throw testError;
    };

    await expect(getThrownError(testFunc)).resolves.toStrictEqual(testError);
  });

  it('should do nothing if the given function catches its own error', async () => {
    expect.assertions(1);

    const testFunc = () => {
      try {
        throw testError;
      } catch (err) {
        // Do nothing
      }
    };

    await expect(getThrownError(testFunc)).resolves.toBeNull();
  });
});

describe('expectFunctionToCatchErrors', () => {
  it('should pass if the given function catches its own error', async () => {
    expect.assertions(1);

    const testFunc = () => {
      try {
        throw testError;
      } catch (err) {
        // Do nothing
      }
    };

    await expectFunctionToCatchErrors(testFunc);
  });
});
