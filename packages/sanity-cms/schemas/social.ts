import { defineField, defineType } from 'sanity';
import type { DocumentFields } from '@session/sanity-types';
import type { SchemaFieldsType } from './types';
import { linkFields } from './fields/groups/link';
import { TwitterIcon } from '@sanity/icons';

// TODO: look into sharing the same source as the ui. socials package? (hopefully not)
enum Socials {
  Discord = 'discord',
  Facebook = 'facebook',
  Github = 'github',
  Instagram = 'instagram',
  LinkedIn = 'linkedin',
  Reddit = 'reddit',
  RSS = 'rss',
  Session = 'session',
  Telegram = 'telegram',
  Vimeo = 'vimeo',
  Whatsapp = 'whatsapp',
  X = 'x',
  Youtube = 'youtube',
}

const supportedSocials = Object.values(Socials);

export const socialFields = [
  defineField({
    type: 'string',
    name: 'social',
    title: 'Social',
    description: 'The social media platform. This determines the icon to show.',
    options: {
      list: [...supportedSocials, 'other'],
    },
    validation: (Rule) => Rule.required(),
  }),
  ...linkFields,
];

export const socialSchema = defineType({
  type: 'document',
  name: 'social',
  title: 'Social',
  icon: TwitterIcon,
  fields: socialFields,
});

export type SocialSchemaType = SchemaFieldsType<typeof socialFields> & DocumentFields;
