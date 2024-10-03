import { defineField, defineType } from 'sanity';
import { seoField } from './fields/basic/seo';
import { routeFields } from './fields/groups/route';
import { copyFieldOf } from './fields/generated/copy';
import type { DocumentFields } from '@session/sanity-types';
import type { SchemaFieldsType } from './types';
import { DocumentIcon } from '@sanity/icons';

export const pageFields = [
  ...routeFields,
  seoField,
  defineField({
    name: 'body',
    title: 'Body',
    description: 'Page content',
    type: 'array',
    of: copyFieldOf,
  }),
];

export const pageSchema = defineType({
  type: 'document',
  name: 'page',
  title: 'Page',
  icon: DocumentIcon,
  fields: pageFields,
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        subtitle: 'Page',
        title,
      };
    },
  },
});

export type PageSchemaType = SchemaFieldsType<typeof pageFields> & DocumentFields;
