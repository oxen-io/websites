import { getPagesInfo } from '@session/sanity-cms/queries/getPages';
import { client } from '@/lib/sanity/sanity.client';
import { getBuildInfo } from '@session/util-js/build';
import { DevSheet } from '@/components/DevSheet';
import { isDraftModeEnabled } from '@session/sanity-cms/lib/util';

export default async function DevSheetServerSide() {
  const pages = await getPagesInfo({ client });
  const isDraftMode = isDraftModeEnabled();
  const buildInfo = getBuildInfo();

  return <DevSheet buildInfo={buildInfo} pages={pages} isDraftMode={isDraftMode} />;
}
