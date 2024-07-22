enum Environment {
  PRD = 'prd',
  STG = 'stg',
  QA = 'qa',
  DEV = 'dev',
}

const environments = [Environment.PRD, Environment.STG, Environment.QA, Environment.DEV];

export const getEnvironment = (): Environment => {
  const environment = process.env.NEXT_PUBLIC_ENV_FLAG;
  if (!environment || !environments.includes(environment as Environment)) {
    console.warn(`Invalid environment flag (NEXT_PUBLIC_ENV_FLAG): ${environment}`);
    return Environment.DEV;
  }
  console.log(`Environment: ${environment}`);
  return environment as Environment;
};

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
