import { defineArrayMember, defineField } from 'sanity';
import { linkFields, type LinkFieldsSchemaType } from '../groups/link';
import { type PageSchemaType } from '../../page';
import { DocumentIcon, LaunchIcon } from '@sanity/icons';
import type { ArrayMemberFields } from '@session/sanity-types';
import { type SocialSchemaType } from '../../social';
import type { SchemaFieldsType } from '../../types';
import type { PostSchemaType } from '../../post';
import type { SessionSanityClient } from '../../../lib/client';
import logger from '../../../lib/logger';
import { getContentById } from '../../../queries/getContent';

export type ExternalLinkArrayMember = LinkFieldsSchemaType &
  ArrayMemberFields & { _type: 'externalLink' };

export const externalLinkFieldDefinition = {
  type: 'object' as const,
  icon: LaunchIcon,
  name: 'externalLink',
  title: 'External Link',
  description: 'Link to an external resource',
  fields: linkFields,
};

export type InternalLinkLinkableSchemaType = PageSchemaType | PostSchemaType;

export type InternalLinkArrayMember = ArrayMemberFields & {
  _type: 'reference' | 'internalLink';
  _ref: string;
  internalLink: InternalLinkLinkableSchemaType;
};

export const internalLinkFieldDefinition = {
  type: 'reference' as const,
  name: 'internalLink',
  title: 'Internal Link',
  icon: DocumentIcon,
  description: 'Link to CMS content',
  to: [{ type: 'page' }, { type: 'post' }, { type: 'special' }],
};

export type SocialLinkArrayMember = ArrayMemberFields & {
  _type: 'socialLink';
  _ref: string;
  socialLink: SocialSchemaType;
};

export const socialLinkFieldDefinition = {
  type: 'reference' as const,
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
  internalLink?: InternalLinkArrayMember;
  socialLink?: SocialLinkArrayMember;
};

/**
 * Resolves a Pick Link Schema to a href and label.
 * @param client - The Sanity client.
 * @param postBaseUrl - The base SANITY_SCHEMA_URL of posts (if any).
 * @param type - The type of the link (external, internal, or social).
 * @param externalLink - The external link (if any).
 * @param internalLink - The internal link (if any).
 * @param socialLink - The social link (if any).
 * @param overrideLabel - The override label (if any).
 * @returns The resolved href and label.
 *
 * @see {PickLinkSchemaType}
 */
export async function resolvePickLink(
  client: SessionSanityClient,
  { type, externalLink, internalLink, socialLink, overrideLabel }: PickLinkSchemaType,
  postBaseUrl?: string
) {
  let link: ExternalLinkArrayMember | InternalLinkArrayMember | SocialLinkArrayMember;
  if (type === 'externalLink') {
    if (!externalLink) {
      logger.error(`External link is missing`);
      return { href: undefined, label: overrideLabel };
    }
    link = externalLink;
  } else if (type === 'internalLink') {
    if (!internalLink) {
      logger.error(`Internal link is missing`);
      return { href: undefined, label: overrideLabel };
    }
    link = internalLink;
  } else if (type === 'socialLink') {
    if (!socialLink) {
      logger.error(`Social link is missing`);
      return { href: undefined, label: overrideLabel };
    }
    const social = await getContentById<SocialSchemaType>({
      client,
      id: socialLink._ref,
    });

    if (!social) {
      logger.error(`Social link is missing`);
      return { href: undefined, label: overrideLabel };
    }

    return { href: social.url, label: overrideLabel ?? social.social };
  } else {
    logger.error(`Unknown pick link type ${type}`);
    return { href: undefined, label: overrideLabel };
  }

  const resolvedLink = await resolveAmbiguousLink(client, link, postBaseUrl);

  return { href: resolvedLink.href, label: overrideLabel ?? resolvedLink.label };
}

/**
 * Resolves an ambiguous link to a href and label.
 * @param client - The Sanity client.
 * @param link - The link to resolve.
 * @param postBaseUrl - The base SANITY_SCHEMA_URL of posts (if any).
 * @returns The resolved href and label.
 *
 * @see {PickLinkSchemaType}
 */
export async function resolveAmbiguousLink(
  client: SessionSanityClient,
  link: ExternalLinkArrayMember | InternalLinkArrayMember,
  postBaseUrl?: string
) {
  if (link._type === 'externalLink') {
    return { href: link.url, label: link.label };
  } else if (link._type === 'reference' || link._type === 'internalLink') {
    const content = await getContentById<PageSchemaType | PostSchemaType>({
      client,
      id: link._ref,
    });

    if (content) {
      let slug = content.slug?.current;
      // CMS slugs should never start or end with a slash
      if (slug?.startsWith('/')) {
        slug = slug.slice(1);
      } else if (slug?.endsWith('/')) {
        slug = slug.slice(0, -1);
      }
      
      if (content._type === 'post') {
        let baseUrl = postBaseUrl?.startsWith('/') ? postBaseUrl : `/${postBaseUrl}`;
        if (!baseUrl.endsWith('/')) {
          baseUrl = `${baseUrl}/`;
        }
        return { href: slug ? `${baseUrl}${slug}` : undefined, label: content.title };
      } else {
        return { href: `/${slug}`, label: content.label };
      }
    } else {
      logger.warn(`No content found for id ${link._ref}`);
    }
  }

  return { href: undefined, label: undefined };
}
