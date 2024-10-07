import { defineField } from 'sanity';
import type { SchemaFieldsType } from '../../types';
import { slugFieldDefinition } from '../basic/slug';

export const routeFields = [
  defineField({
    name: 'label',
    type: 'string' as const,
    title: 'Label',
    group: 'route',
    description: (
      <p>
        The label for links to this route.
        <strong>
          This is ONLY used for link labels. It is not rendered anywhere else and not used for SEO.
        </strong>
      </p>
    ),
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    ...slugFieldDefinition,
    group: 'route',
  }),
];

export type RouteFieldsSchemaType = SchemaFieldsType<typeof routeFields>;
