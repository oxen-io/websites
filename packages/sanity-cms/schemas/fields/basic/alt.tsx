import { defineField } from 'sanity';

export const altField = defineField({
  title: 'Alternative Text',
  description: (
    <p>
      Describe the image for screen readers and search engines. It is not meant to supplement the
      image and should not repeat information that is already provided in the context around the
      image.{' '}
      <a
        href="https://html.spec.whatwg.org/multipage/images.html#general-guidelines"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn More.
      </a>
    </p>
  ),
  name: 'alt',
  type: 'string',
  validation: (Rule) => Rule.required(),
});
