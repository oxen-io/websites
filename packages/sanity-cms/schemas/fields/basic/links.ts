import { defineArrayMember, defineField } from 'sanity';
import { linkFields, type LinkFieldsSchemaType } from '../groups/link';
import { type PageSchemaType } from '../../page';
import { LaunchIcon } from '@sanity/icons';
import type { ArrayMemberFields } from '@session/sanity-types';
import { type SocialSchemaType } from '../../social';
import type { SchemaFieldsType } from '../../types';

export type ExternalLinkArrayMember = LinkFieldsSchemaType &
  ArrayMemberFields & { _type: 'externalLink' };

export const externalLinkFieldDefinition = {
  type: 'object',
  icon: LaunchIcon,
  name: 'externalLink',
  title: 'External Link',
  description: 'Link to an external resource',
  fields: linkFields,
};

export type InternalLinkArrayMember = ArrayMemberFields & {
  _type: 'internalLink';
  internalLink: PageSchemaType;
};

export const internalLinkFieldDefinition = {
  type: 'reference',
  name: 'internalLink',
  title: 'Internal Link',
  description: 'Link to a CMS content',
  to: [{ type: 'page' }],
};

export type SocialLinkArrayMember = ArrayMemberFields & {
  _type: 'socialLink';
  socialLink: SocialSchemaType;
};

export const socialLinkFieldDefinition = {
  type: 'reference',
  name: 'socialLink',
  title: 'Social Link',
  description: 'Link to a social media account',
  to: [{ type: 'social' }],
};

export const linksFieldDefinition = {
  title: 'Links',
  name: 'links',
  description: 'Links to CMS content or external resources',
  type: 'array' as const,
  of: [
    defineArrayMember(externalLinkFieldDefinition),
    defineArrayMember(internalLinkFieldDefinition),
    defineArrayMember(socialLinkFieldDefinition),
  ],
};

export const linksField = defineField(linksFieldDefinition);

const pickLinkFieldFields = [
  defineField({ name: 'overrideLabel', type: 'string', title: 'Override Label' }),
  defineField({
    title: 'Select Link Type',
    name: 'type',
    type: 'string',
    options: {
      list: [
        { title: 'External Link', value: 'externalLink' },
        { title: 'Internal Link', value: 'internalLink' },
        { title: 'Social Link', value: 'socialLink' },
      ],
    },
  }),
  defineField({
    ...externalLinkFieldDefinition,
    hidden: ({ parent }) => parent?.type !== 'externalLink',
  }),
  defineField({
    ...internalLinkFieldDefinition,
    hidden: ({ parent }) => parent?.type !== 'internalLink',
  }),
  defineField({
    ...socialLinkFieldDefinition,
    hidden: ({ parent }) => parent?.type !== 'socialLink',
  }),
];

export const pickLinkFieldDefinition = {
  title: 'Pick Link',
  name: 'pickLink',
  description: 'Link to a CMS content or external resource',
  type: 'object' as const,
  fields: pickLinkFieldFields,
};

export const pickLinkField = defineField(pickLinkFieldDefinition);

export type PickLinkSchemaType = SchemaFieldsType<typeof pickLinkFieldFields> & {
  type: 'externalLink' | 'internalLink' | 'socialLink';
  externalLink?: ExternalLinkArrayMember;
  internalLink?: InternalLinkArrayMember & { _ref: string };
  socialLink?: SocialLinkArrayMember;
};
