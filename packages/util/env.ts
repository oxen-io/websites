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

const environments = [Environment.PRD, Environment.STG, Environment.QA, Environment.DEV];

/**
 * Retrieves the current environment based on the value of the NEXT_PUBLIC_ENV_FLAG environment variable.
 * If the environment flag is invalid or not set, it defaults to the development environment.
 * @returns The current environment.
 */
export const getEnvironment = (): Environment => {
  const environment = process.env.NEXT_PUBLIC_ENV_FLAG;
  if (!environment || !environments.includes(environment as Environment)) {
    console.warn(`Invalid environment flag (NEXT_PUBLIC_ENV_FLAG): ${environment}`);
    return Environment.DEV;
  }
  if (environment !== Environment.PRD) console.log(`Environment: ${environment}`);
  return environment as Environment;
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
