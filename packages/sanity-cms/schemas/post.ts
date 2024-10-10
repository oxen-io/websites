import { defineField, defineType } from 'sanity';
import { copyFieldOf, type CopyFieldOfType } from './fields/generated/copy';
import type { DocumentFields } from '@session/sanity-types';
import type { SchemaFieldsType } from './types';
import { BinaryDocumentIcon, EarthGlobeIcon, EditIcon, RobotIcon } from '@sanity/icons';
import { seoField } from './fields/basic/seo';
import { imageFieldDefinition } from './fields/basic/image';
import { altField } from './fields/basic/alt';
import { slugFieldDefinition } from './fields/basic/slug';

export const postFields = [
  defineField({
    name: 'title',
    title: 'Title',
    description: 'Post title. Shown as the excerpt and in feeds.',
    type: 'string',
    group: 'post',
  }),
  defineField({
    ...slugFieldDefinition,
    group: 'post',
  }),
  seoField,
  defineField({
    ...imageFieldDefinition,
    name: 'featuredImage',
    title: 'Featured Image',
    description: 'Featured image',
    group: 'post',
    fields: [altField],
  }),
  defineField({
    name: 'date',
    title: 'Date',
    description: 'Displayed post publish date',
    type: 'date',
    initialValue: () => {
      const date = new Date();
      // Format the date as YYYY-MM-DD
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    options: {
      dateFormat: 'MMMM D, YYYY',
    },
    group: 'post',
  }),
  defineField({
    name: 'author',
    title: 'Author',
    type: 'reference',
    to: [{ type: 'author' }],
    group: 'post',
  }),
  defineField({
    name: 'tags',
    title: 'Tags',
    description: 'Post tags',
    type: 'array',
    of: [{ type: 'string' }],
    group: 'post',
  }),
  defineField({
    name: 'summary',
    title: 'Summary',
    description: 'Post summary. Shown as the excerpt and in feeds.',
    type: 'text',
    group: 'post',
  }),
  defineField({
    name: 'body',
    title: 'Body',
    description: 'Post content',
    type: 'array',
    of: copyFieldOf,
    group: 'post',
  }),
];

export const postSchema = defineType({
  type: 'document',
  name: 'post',
  title: 'Post',
  icon: BinaryDocumentIcon,
  fields: postFields,
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
      title: 'Post',
      name: 'post',
      icon: EditIcon,
      default: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      author: 'author.name',
    },
    prepare({ title, author, date }) {
      return {
        subtitle: `Post by ${author} | ${date}`,
        title,
      };
    },
  },
});

export type PostSchemaType = DocumentFields<typeof postSchema> &
  Omit<SchemaFieldsType<typeof postFields>, 'body'> & {
    body: CopyFieldOfType;
  };
