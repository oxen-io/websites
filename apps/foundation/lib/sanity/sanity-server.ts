import 'server-only';

import { client } from '@/lib/sanity/sanity.client';
import {
  QUERY_GET_SITE_SETTINGS,
  type QUERY_GET_SITE_SETTINGS_RETURN_TYPE,
} from '@session/sanity-cms/queries/getSiteSettings';
import logger from '@/lib/logger';

let siteData: SiteData | null = null;

type SiteData = {
  settings: QUERY_GET_SITE_SETTINGS_RETURN_TYPE[0];
};

export const getInitialSiteDataForSSR = async (): Promise<SiteData> => {
  if (siteData) {
    return siteData;
  }
  const [err, result] = await client.nextFetch<QUERY_GET_SITE_SETTINGS_RETURN_TYPE>({
    query: QUERY_GET_SITE_SETTINGS,
  });

  if (err) {
    logger.error(err);
    throw err;
  }
  const siteSettings = result[0];

  if (!siteSettings) {
    logger.info(`Site settings not found`);
    throw new Error(`Site settings not found`);
  }

  siteData = { settings: siteSettings };

  return { settings: siteSettings };
};

export const getLandingPageSlug = async () => {
  const { settings } = await getInitialSiteDataForSSR();
  const landingSlug = settings?.landingPage?.slug?.current;
  if (!landingSlug) {
    logger.warn('No landing page set in settings');
    return null;
  }
  return landingSlug;
};
