import { defineField, type SlugRule } from 'sanity';

export const slugFieldDefinition = {
  name: 'slug' as const,
  type: 'slug' as const,
  title: 'Slug',
  options: {
    source: 'label',
  },
  validation: (Rule: SlugRule) =>
    Rule.required()
      .custom((slug) => {
        if (!slug?.current) return true;
        if (slug.current.startsWith('/')) {
          return 'The slug cannot start with a "/"';
        }
        return true;
      })
      .error(),
};

export const slugField = defineField(slugFieldDefinition);
