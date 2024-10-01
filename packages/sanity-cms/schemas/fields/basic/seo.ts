import { defineField } from 'sanity';

export const seoField = defineField({
  title: 'SEO',
  name: 'seo',
  type: 'seoMetaFields',
});

export const seoPreview = {
  select: {
    metaTitle: 'seo',
  },
  prepare(selection: { metaTitle?: string }) {
    const metaTitle = selection?.metaTitle || '';
    return {
      title: metaTitle || 'seo',
    };
  },
};
