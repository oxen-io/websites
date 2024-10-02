import type { PickLinkSchemaType } from '../schemas/fields/basic/links';
import { Button } from '@session/ui/ui/button';
import { NavLink } from '@session/ui/components/NavLink';
import logger from '../lib/logger';
import { getPageById } from '../queries/getPage';
import type { SessionSanityClient } from '../lib/client';

type SanityButtonProps = {
  value: {
    pickLink: PickLinkSchemaType;
  };
  client: SessionSanityClient;
};

export async function SanityButton(props: SanityButtonProps) {
  const { value, client } = props;
  const { type, internalLink, externalLink, socialLink, overrideLabel } = value.pickLink;
  let href: string | undefined;
  let label = overrideLabel;

  if (type === 'externalLink' && externalLink) {
    href = externalLink.url;
    label = externalLink.label;
  } else if (type === 'internalLink' && internalLink) {
    const page = await getPageById({ client, id: internalLink._ref });
    href = page?.slug.current;
  } else if (type === 'socialLink' && socialLink) {
    href = socialLink.socialLink.url;
  }

  if (!href || !label) {
    logger.warn('SanityButton: Missing href or label');
    return null;
  }

  return (
    <NavLink href={href}>
      <Button data-testid={`button:sanity-${label}`} variant="secondary" rounded="md">
        {label}
      </Button>
    </NavLink>
  );
}
