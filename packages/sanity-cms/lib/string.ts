import { stegaClean } from 'next-sanity';

export const cleanSanityString = (str: string) => {
  return stegaClean(str);
};
