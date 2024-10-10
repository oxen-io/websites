import { defineField } from 'sanity';
import type { SchemaFieldsType } from '../../types';
import { urlField } from '../basic/url';

export const linkFields = [
  defineField({
    name: 'label',
    type: 'string',
    title: 'Label',
    description: 'The label of the link. If none is provided, the full link will be used.',
  }),
  urlField,
];

export type LinkFieldsSchemaType = SchemaFieldsType<typeof linkFields>;
