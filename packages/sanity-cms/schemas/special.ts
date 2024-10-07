import { defineType } from 'sanity';
import { routeFields } from './fields/groups/route';
import type { DocumentFields } from '@session/sanity-types';
import type { SchemaFieldsType } from './types';
import { EarthGlobeIcon, IceCreamIcon } from '@sanity/icons';

export const specialFields = routeFields;

export const specialSchema = defineType({
  type: 'document',
  name: 'special',
  title: 'Special',
  icon: IceCreamIcon,
  fields: specialFields,
  groups: [
    {
      title: 'Route',
      name: 'route',
      icon: EarthGlobeIcon,
    },
  ],
  preview: {
    select: {
      title: 'label',
    },
    prepare({ title }) {
      return {
        subtitle: 'special',
        title,
      };
    },
  },
});

export type specialSchemaType = DocumentFields<typeof specialSchema> &
  SchemaFieldsType<typeof specialFields>;
