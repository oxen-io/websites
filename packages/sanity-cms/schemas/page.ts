import { defineField, defineType } from 'sanity';
import { seoField } from './fields/basic/seo';
import { routeFields } from './fields/groups/route';
import { copyFieldOf, type CopyFieldOfType } from './fields/generated/copy';
import type { DocumentFields } from '@session/sanity-types';
import type { SchemaFieldsType } from './types';
import { DocumentIcon, EarthGlobeIcon, EditIcon, RobotIcon } from '@sanity/icons';

export const pageFields = [
  ...routeFields,
  seoField,
  defineField({
    name: 'body',
    title: 'Body',
    group: 'content',
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
  groups: [
    {
      title: 'Route',
      name: 'route',
      icon: EarthGlobeIcon,
    },
    {
      title: 'SEO',
      name: 'seo',
      icon: RobotIcon,
    },
    {
      title: 'Content',
      name: 'content',
      icon: EditIcon,
      default: true,
    },
  ],
  preview: {
    select: {
      title: 'label',
    },
    prepare({ title }) {
      return {
        subtitle: 'Page',
        title,
      };
    },
  },
});

export type PageSchemaType = DocumentFields<typeof pageSchema> &
  Omit<SchemaFieldsType<typeof pageFields>, 'body'> & {
    body: CopyFieldOfType;
  };
