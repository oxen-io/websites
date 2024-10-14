export const parseSanityCdnUrl = (url: string) => {
  return url.replaceAll('\u200B', '');
};
