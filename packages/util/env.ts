enum Environment {
  Development = 'development',
  Dev = 'dev',
  Production = 'production',
  Prod = 'prod',
  Staging = 'staging',
  Stg = 'stg',
  Testing = 'testing',
  Test = 'test',
}

/**
 * Checks if the current environment is not production.
 * This function checks if the environment is not production by checking if the
 * environment is not set or if it is set to a development, staging, or testing environment.
 * @returns {boolean} Returns true if the environment is not production, false otherwise.
 */
export const isNotProduction = (): boolean => {
  return (
    !process.env.NEXT_PUBLIC_SITE_ENV ||
    [
      Environment.Development,
      Environment.Dev,
      Environment.Staging,
      Environment.Stg,
      Environment.Testing,
      Environment.Test,
    ].includes(process.env.NEXT_PUBLIC_SITE_ENV as Environment)
  );
};

/**
 * Checks if the current environment is production. This function is calls {@link isNotProduction} and inverts the result.
 * @returns {boolean} Returns true if the environment is production, false otherwise.
 */
export const isProduction = (): boolean => {
  return !isNotProduction();
};
