import urlBuilder from '@sanity/image-url';
import { getImageDimensions, type SanityImageSource } from '@sanity/asset-utils';
import type { SessionSanityClient } from '../lib/client';

export const SanityImage = ({
  value,
  isInline,
  client,
}: {
  value: SanityImageSource & { alt?: string };
  isInline: boolean;
  client: SessionSanityClient;
}) => {
  const { width, height } = getImageDimensions(value);
  return (
    <img
      src={urlBuilder(client).image(value).fit('max').auto('format').url()}
      alt={value.alt}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? 'inline-block' : 'block',

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }}
    />
  );
};
