import {
  basicComponents,
  type SanityPortableTextProps,
} from '@session/sanity-cms/components/SanityPortableText';
import { SanityImage } from '@session/sanity-cms/components/SanityImage';
import { client } from '@/lib/sanity/sanity.client';
import { SanityButton } from '@session/sanity-cms/components/SanityButton';
import { SANITY_SCHEMA_URL } from '@/lib/constants';
import { getLocale, getTranslations } from 'next-intl/server';
import { getLangDir } from 'rtl-detect';
import { SanityTiles } from '@session/sanity-cms/components/SanityTiles';

const { marks, block } = basicComponents;
export const components = {
  marks,
  block,
  types: {
    image: async ({ value, isInline }) => {
      const imageDictionary = await getTranslations('image');
      return (
        <SanityImage
          value={value}
          isInline={isInline}
          client={client}
          figureNumberTextTemplate={imageDictionary('figureLabelTemplate')}
          className="my-4 md:my-6"
        />
      );
    },
    button: (props) => (
      <SanityButton {...props} client={client} postBaseUrl={SANITY_SCHEMA_URL.POST} />
    ),
    tiles: async (props) => {
      const tileDictionary = await getTranslations('tile');
      const locale = await getLocale();
      const direction = getLangDir(locale);

      return (
        <SanityTiles
          {...props}
          client={client}
          scrollText={tileDictionary('scrollOrTap')}
          isRTLLocale={direction === 'rtl'}
        />
      );
    },
  },
} satisfies SanityPortableTextProps['components'];
