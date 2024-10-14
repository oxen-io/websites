import { getSanityImageUrlBuilder } from '../components/SanityImage';
import type { SeoType } from '../schemas/fields/basic/seo';
import type { Metadata, ResolvedMetadata } from 'next';
import type { SessionSanityClient } from './client';

type GenericMetadataProps = {
  seo?: SeoType;
  parentMetadata?: ResolvedMetadata;
};

type MetadataProps = GenericMetadataProps &
  (
    | {
        type: 'article';
        publishedTime?: string;
        authors?: null | string | URL | Array<string | URL>;
        tags?: null | string | Array<string>;
      }
    | {
        type: 'website';
      }
  );

export async function generateSanityMetadata(
  client: SessionSanityClient,
  props: MetadataProps
): Promise<Metadata> {
  const { seo, parentMetadata, type } = props;

  /** Base SEO */
  const title =
    seo?.metaTitle ||
    seo?.openGraph?.title ||
    parentMetadata?.title ||
    parentMetadata?.openGraph?.title;

  const description =
    seo?.metaDescription ||
    seo?.openGraph?.description ||
    parentMetadata?.description ||
    parentMetadata?.openGraph?.description;

  const keywords = seo?.seoKeywords?.filter((keyword) => !!keyword);

  /** Open Graph */
  const ogTitle = seo?.openGraph?.title || parentMetadata?.openGraph?.title;
  const ogDescription = seo?.openGraph?.description || parentMetadata?.openGraph?.description;

  const sanityOgImage = seo?.openGraph?.image
    ? generateMetaImage(client, seo?.openGraph?.image)
    : null;

  const sanityMetaImage = seo?.metaImage ? generateMetaImage(client, seo?.metaImage) : null;

  const ogImage = sanityOgImage || sanityMetaImage || parentMetadata?.openGraph?.images?.[0];

  return {
    title: title,
    description: description,
    keywords: keywords?.length ? keywords : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage,
      ...(type === 'article'
        ? {
            type: 'article',
            publishedTime: props.publishedTime,
            authors: props.authors,
            tags: props.tags,
          }
        : {
            type: 'website',
          }),
    },
  };
}

function generateMetaImage(client: SessionSanityClient, image: NonNullable<SeoType['metaImage']>) {
  return getSanityImageUrlBuilder(client, image).width(1200).height(630).fit('crop').url();
}
