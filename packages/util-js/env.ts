export enum Environment {
  /** Production */
  PRD = 'prd',
  /** Staging */
  STG = 'stg',
  /** QA Testing */
  QA = 'qa',
  /** Development */
  DEV = 'dev',
}

/** The current environment. */
let env: null | Environment = null;

const environments = [Environment.PRD, Environment.STG, Environment.QA, Environment.DEV];

/** Clears the environment variable and resets it to null. */
export const clearEnvironment = () => (env = null);

/**
 * Checks if the given environment is valid. And casts it's type to Environment if it is.
 * @param environment - The environment to check.
 * @returns True if the environment is valid, false otherwise.
 */
export const isEnvironment = (environment: string): environment is Environment =>
  environments.includes(environment as Environment);

/**
 * Sets the environment variable and logs a message if the environment is not valid.
 * @param environment - The environment to set.
 * @returns The environment.
 */
export const setEnvironment = (environment: Environment) => {
  if (!isEnvironment(environment)) {
    console.warn(`Invalid environment: ${environment}`);
    env = Environment.DEV;
  } else {
    env = environment;
  }
  if (env !== Environment.PRD) console.log(`Environment: ${env}`);
  return env;
};

/**
 * Retrieves the current environment based on the value of {@link env}. If the environment is not
 * set, it defaults to fetches it from the NEXT_PUBLIC_ENV_FLAG environment variable.
 *
 * @see {getEnvironmentFromEnvFlag}
 *
 * @returns The current environment.
 */
export const getEnvironment = (): Environment => env ?? getEnvironmentFromEnvFlag();

/**
 * Retrieves the current environment based on the value of the NEXT_PUBLIC_ENV_FLAG environment variable.
 * If the environment flag is invalid or not set, it defaults to the development environment.
 * @returns The current environment.
 */
export const getEnvironmentFromEnvFlag = (): Environment => {
  return setEnvironment(process.env.NEXT_PUBLIC_ENV_FLAG as Environment);
};

/**
 * Checks if the current environment is production.
 * @returns {boolean} Returns true if the current environment is production, false otherwise.
 */
export const isProduction = (): boolean => getEnvironment() === Environment.PRD;

/**
 * Returns the domain with environment tag based on the root subdomain and current environment.
 * @param rootSubdomain - The root subdomain to be used in the domain. This is required if the production site is on a subdomain.
 * @returns The domain with environment tag.
 */
export const getEnvironmentTaggedDomain = (rootSubdomain?: string): string => {
  const environment = getEnvironment();

  if (rootSubdomain) {
    return environment === Environment.PRD ? rootSubdomain : `${rootSubdomain}-${environment}`;
  }

  return environment === Environment.PRD ? '' : environment;
};
