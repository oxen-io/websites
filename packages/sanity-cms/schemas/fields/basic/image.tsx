import { defineField } from 'sanity';
import type { SchemaFieldsType } from '../../types';
import { altField } from './alt';

const imageFields = [
  defineField({
    title: 'Priority Loading',
    description: (
      <p>
        Load the image immediately when the page loads. This must only be used for images that are
        immediately visible on screen when the page loads.{' '}
        <strong>
          Don't enable this inside a rich copy block. Rich copy blocks override this setting.
        </strong>
      </p>
    ),
    name: 'priority',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    title: 'Rounded Corners',
    description: (
      <p>
        Round the image corners.{' '}
        <strong>If the image already has rounded corners, this must be enabled.</strong>
      </p>
    ),
    name: 'rounded',
    type: 'boolean',
    initialValue: true,
  }),
];

const captionFields = [
  defineField({
    name: 'caption',
    type: 'string' as const,
    title: 'Caption',
    description:
      'The image caption, This should only be used if you want a visible figure caption below the image.',
  }),
  defineField({
    name: 'calculateFigureNumber',
    type: 'boolean' as const,
    title: 'Display calculated Figure Number',
    description: (
      <p>
        Calculate the figure number for the image. This will add a number to the start of the
        caption. Eg:
        <br />
        <span>
          <strong>Figure 2:</strong> YOUR CAPTION GOES HERE
        </span>
        <br />
        This should be used in content that has multiple images.
      </p>
    ),
    hidden: ({ parent }) => !parent?.caption?.length,
  }),
];

const imageFieldsWithAltAndOptionalCaption = [...imageFields, altField, ...captionFields];

export const imageFieldDefinition = {
  name: 'image',
  type: 'image' as const,
  title: 'Image',
  description: 'An image will full accessibility support',
  options: {
    hotspot: true,
  },
  fields: imageFieldsWithAltAndOptionalCaption,
};

export const imageField = defineField(imageFieldDefinition);

export const imageFieldWithOutAltText = defineField({
  ...imageFieldDefinition,
  fields: imageFields,
});

export type ImageFieldsSchemaType = SchemaFieldsType<typeof imageFieldsWithAltAndOptionalCaption>;
export type ImageFieldsSchemaTypeWithoutAltText = SchemaFieldsType<typeof imageFields>;
