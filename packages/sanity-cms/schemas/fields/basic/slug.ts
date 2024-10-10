import { defineField, type SlugRule } from 'sanity';

export const slugFieldDefinition = {
  name: 'slug' as const,
  type: 'slug' as const,
  title: 'Slug',
  options: {
    source: 'label',
  },
  validation: (Rule: SlugRule) => Rule.required(),
};

export const slugField = defineField(slugFieldDefinition);
