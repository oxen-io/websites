export type GenericFeatureFlag = string;
export type GenericExperimentalFeatureFlag = `experimental_${string}`;
export type GenericRemoteFeatureFlag = `remote_${string}`;
export type FeatureFlags<Flag extends GenericFeatureFlag> = Record<Flag, boolean>;

export const isExperimentalFeatureFlag = (flag: string): flag is GenericExperimentalFeatureFlag =>
  flag.startsWith('experimental_');

export const isRemoteFeatureFlag = (flag: string): flag is GenericRemoteFeatureFlag =>
  flag.startsWith('remote_');
