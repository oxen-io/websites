import { defineArrayMember, defineField } from 'sanity';
import { tileFields, type TileSchemaType } from './tile';
import type { SchemaFieldsType } from '../../types';
import type { ArrayMemberFields } from '@session/sanity-types';

export enum TILES_VARIANT {
  TEXT_OVERLAY_IMAGE = 'text-overlay-image',
  TEXT_UNDER_IMAGE = 'text-under-image',
}

const tileVariants = Object.values(TILES_VARIANT);

export const isTileVariant = (value: string): value is TILES_VARIANT =>
  tileVariants.includes(value as TILES_VARIANT);

const tileVariantsWithTitles = [
  { value: TILES_VARIANT.TEXT_OVERLAY_IMAGE, title: 'Text overlay on top of the image' },
  { value: TILES_VARIANT.TEXT_UNDER_IMAGE, title: 'Text below the image' },
];

export const tilesFields = [
  defineField({
    name: 'variant',
    title: 'Variant',
    type: 'string',
    description: 'The variant of the tiles',
    options: {
      list: tileVariantsWithTitles,
      layout: 'radio',
    },
    initialValue: TILES_VARIANT.TEXT_OVERLAY_IMAGE,
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'tiles',
    title: 'Tiles',
    description: 'List of tiles',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        title: 'Tile',
        fields: tileFields,
      }),
    ],
  }),
];

export type TilesSchemaType = Omit<SchemaFieldsType<typeof tilesFields>, 'tiles'> & {
  tiles: Array<TileSchemaType & ArrayMemberFields>;
} & { _key: string };
