import { defineField } from 'sanity';
import type { SchemaFieldsType } from '../../types';
import { imageFieldWithOutAltText } from '../basic/image';

export const tileFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    description: 'The title of the tile',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'description',
    title: 'Description',
    type: 'string',
    description: 'The text content of the tile',
  }),
  imageFieldWithOutAltText,
];

export type TileSchemaType = SchemaFieldsType<typeof tileFields>;
