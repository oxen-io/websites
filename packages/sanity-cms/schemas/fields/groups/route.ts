import { defineField } from 'sanity';
import type { SchemaFieldsType } from '../../types';

export const routeFields = [
  defineField({
    name: 'title',
    type: 'string',
    title: 'Title',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'slug',
    type: 'slug',
    title: 'Slug',
    options: {
      source: 'title',
    },
    validation: (Rule) => Rule.required(),
  }),
];

export type RouteFieldsSchemaType = SchemaFieldsType<typeof routeFields>;
