import urlBuilder from '@sanity/image-url';
import type { SessionSanityClient } from '../lib/client';
import Image from 'next/image';
import logger from '../lib/logger';
import { getPlaiceholder } from 'plaiceholder';
import type {
  ImageFieldsSchemaType,
  ImageFieldsSchemaTypeWithoutAltText,
} from '../schemas/fields/basic/image';
import { cn } from '@session/ui/lib/utils';
import { safeTry } from '@session/util-js/try';
import { Fragment } from 'react';

export type SanityImageType = ImageFieldsSchemaType | ImageFieldsSchemaTypeWithoutAltText;

/**
 * Build image data from Sanity image schema and the image source.
 * @param client Sanity client
 * @param value Sanity image schema
 */
async function buildImage(client: SessionSanityClient, value: SanityImageType) {
  const src = urlBuilder(client).image(value).fit('max').auto('format').url();
  const buffer = await fetch(src).then(async (res) => Buffer.from(await res.arrayBuffer()));

  const {
    metadata: { height, width },
    base64,
  } = await getPlaiceholder(buffer, { size: 16 });

  return { src, height, width, base64 };
}

type SanityImageProps = {
  value: SanityImageType;
  client: SessionSanityClient;
  isInline?: boolean;
  cover?: boolean;
  renderWithPriority?: boolean;
  figureNumberTextTemplate?: string;
  className?: string;
};
export const SanityImage = async ({
  value,
  isInline,
  client,
  cover,
  renderWithPriority,
  figureNumberTextTemplate = 'Figure {number}:',
  className,
}: SanityImageProps) => {
  let imageData = {
    src: '',
    height: 0,
    width: 0,
    base64: '',
  };

  const [err, res] = await safeTry(buildImage(client, value));

  if (err) {
    logger.error(err);
  } else {
    imageData = res;
  }

  const { src, height, width, base64 } = imageData;

  /**
   * If the image schema has an alt text field declared and the value is not empty,
   * use the value as the alt text, otherwise use an empty string and log a warning.
   *
   * If the image schema does not have an alt text field defined, use an empty string.
   */
  let alt = '';
  if ('alt' in value) {
    if (value.alt) {
      alt = value.alt;
    } else {
      logger.warn(`Missing alt text for image: ${src}`);
    }
  }

  const priority = renderWithPriority ?? value.priority ?? false;

  const hasCaption = 'caption' in value && value.caption?.length;
  const figureNumber = 'figureNumber' in value ? value.figureNumber : null;

  const Comp = cover ? 'figure' : Fragment;

  return (
    <Comp>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          value.rounded && 'rounded-2xl',
          /** Display alongside text if image appears inside a block text span */
          isInline ? 'inline-block' : 'block',
          cover && 'object-cover',
          className
        )}
        style={{
          /** Avoid jumping around with aspect-ratio CSS property */
          aspectRatio: width / height,
        }}
        /**
         * NOTE: Blur is REQUIRED for `blurDataURL` to work.
         * https://nextjs.org/docs/app/api-reference/components/image#blurdataurl
         */
        {...(base64
          ? {
              blurDataURL: base64,
              placeholder: 'blur',
            }
          : {
              placeholder: 'empty',
            })}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
      {hasCaption ? (
        <figcaption className="mt-2 inline-flex gap-1 text-sm italic">
          {figureNumber ? (
            <strong>
              {figureNumberTextTemplate?.replace('{number}', figureNumber.toString())}
            </strong>
          ) : null}
          <p>{value.caption}</p>
        </figcaption>
      ) : null}
    </Comp>
  );
};
