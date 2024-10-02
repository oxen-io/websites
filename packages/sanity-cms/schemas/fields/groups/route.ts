import { defineField } from 'sanity';
import type { SchemaFieldsType } from '../../types';

export const routeFields = [
  defineField({
    name: 'label',
    type: 'string',
    title: 'Label',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'slug',
    type: 'slug',
    title: 'Slug',
    options: {
      source: 'label',
    },
    validation: (Rule) => Rule.required(),
  }),
];

export type RouteFieldsSchemaType = SchemaFieldsType<typeof routeFields>;
