import { safeTry, safeTrySync } from '../try';
import { expectFunctionToCatchErrors } from '@session/testing/expectations';

const testError = new Error('foo');

describe('safeTry', () => {
  it('should return a tuple with the result of the promise', async () => {
    expect.assertions(5);

    const result = await safeTry(Promise.resolve('foo'));

    expect(result).toEqual([null, 'foo']);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeNull();
    expect(result[1]).toBe('foo');
  });

  it('should return a tuple with an error if the promise rejects', async () => {
    expect.assertions(5);

    const result = await safeTry(Promise.reject(testError));

    expect(result).toEqual([testError, null]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[1]).toBeNull();
  });

  it('should return a tuple with the result of the async function promise', async () => {
    expect.assertions(5);

    const func = async () => 'foo';
    const result = await safeTry(func());

    expect(result).toEqual([null, 'foo']);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeNull();
    expect(result[1]).toBe('foo');
  });

  it('should return a tuple with an error if the async function throws an error', async () => {
    expect.assertions(5);

    const func = async () => {
      throw testError;
    };
    const result = await safeTry(func());

    expect(result).toEqual([testError, null]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[1]).toBeNull();
  });

  it('should catch any errors thrown by the function', async () => {
    expect.assertions(1);

    const testFunc = async () => {
      throw testError;
    };

    await expectFunctionToCatchErrors(() => safeTry(testFunc()));
  });
});

describe('safeTrySync', () => {
  it('should return a tuple with the result of the function', () => {
    expect.assertions(5);

    const result = safeTrySync(() => 'foo');

    expect(result).toEqual([null, 'foo']);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeNull();
    expect(result[1]).toBe('foo');
  });

  it('should return a tuple with an error if the function throws an error', () => {
    expect.assertions(5);

    const result = safeTrySync(() => {
      throw testError;
    });

    expect(result).toEqual([testError, null]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[1]).toBeNull();
  });

  describe('bad behaviour handled', () => {
    /** This is a TypeScript test, if the ts type fails the test will fail to compile. */
    it('should have a type error if the function is asynchronous', async () => {
      expect.assertions(0);

      // @ts-expect-error - TS error if the function is asynchronous
      safeTrySync(async () => 'test');
    });

    it('should resolve the result promise if the function is asynchronous', async () => {
      expect.assertions(5);

      // @ts-expect-error - This should be a TS error as the function is asynchronous
      const result = safeTrySync(async () => 'test');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeNull();
      expect(result[1]).toBeInstanceOf(Promise);
      await expect(result[1]).resolves.toBe('test');
    });

    it('should throw an error if the function is asynchronous and throws an error', async () => {
      expect.assertions(5);

      // @ts-expect-error - This should be a TS error as the function is asynchronous
      const result = safeTrySync(async () => {
        throw testError;
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeNull();
      expect(result[1]).toBeInstanceOf(Promise);
      await expect(result[1]).rejects.toThrow(testError);
    });
  });
});
