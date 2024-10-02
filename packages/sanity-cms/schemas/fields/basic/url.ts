import { defineField } from 'sanity';

const checkedUrlResults = new Map<string, string | true>();

export const urlField = defineField({
  name: 'url',
  type: 'url',
  title: 'URL',
  description:
    'An external link. If you want to link to an internal link (page or blog post), you must use a reference.',
  validation: (Rule) =>
    Rule.required()
      .uri({ allowRelative: false })
      .custom((url) => {
        if (!url) return true;
        const cachedResult = checkedUrlResults.get(url);
        if (cachedResult) {
          return cachedResult;
        }
        return fetch(`/api/validate-url?urlToCheck=${url}`).then((res) => {
          const val = res.ok ? true : res.statusText;
          checkedUrlResults.set(url, val);
          return val;
        });
      })
      .warning(),
});
