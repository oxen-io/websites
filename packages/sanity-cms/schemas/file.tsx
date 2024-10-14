import { defineField, defineType } from 'sanity';
import type { DocumentFields } from '@session/sanity-types';
import type { SchemaFieldsType } from './types';
import { specialFields, specialSchema } from './special';
import { DocumentPdfIcon, EarthGlobeIcon } from '@sanity/icons';
import { routeFields } from './fields/groups/route';

export const fileFields = [
  ...routeFields,
  defineField({
    title: 'File',
    name: 'file',
    type: 'file',
  }),
];

export const fileSchema = defineType({
  type: 'document',
  name: 'cmsFile',
  title: 'File',
  icon: DocumentPdfIcon,
  fields: fileFields,
  groups: [
    {
      title: 'Route',
      name: 'route',
      icon: EarthGlobeIcon,
    },
  ],
});

export type fileSchemaType = DocumentFields<typeof specialSchema> &
  SchemaFieldsType<typeof specialFields>;
