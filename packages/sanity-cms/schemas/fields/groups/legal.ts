import { defineField } from 'sanity';
import type { SchemaFieldsType } from '../../types';

export const legalFields = [
  defineField({
    name: 'copyright',
    title: 'Copyright',
    type: 'string',
    placeholder: 'My Org',
    group: 'legal',
    description: 'Copyright info without the copyright symbol © (which is added automatically).',
    validation: (rule) =>
      rule
        .custom((content) => {
          if (content?.includes('©')) {
            return 'Copyright text must not include the copyright symbol © as it will be added automatically';
          }
          return true;
        })
        .warning(),
  }),
  defineField({
    name: 'privacyPolicy',
    title: 'Privacy Policy',
    group: 'legal',
    type: 'url',
    description: 'The URL to the privacy policy for the site.',
  }),
  defineField({
    name: 'termsOfUse',
    title: 'Terms of Use',
    group: 'legal',
    type: 'url',
    description: 'The URL to the terms of use for the site.',
  }),
];

export type LegalFieldsSchemaType = SchemaFieldsType<typeof legalFields>;
