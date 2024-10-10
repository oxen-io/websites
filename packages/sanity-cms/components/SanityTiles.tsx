import type { SessionSanityClient } from '../lib/client';
import {
  isTileVariant,
  TILES_VARIANT,
  type TilesSchemaType,
} from '../schemas/fields/component/tiles';
import { SanityTile } from './SanityTile';
import { cn } from '@session/ui/lib/utils';
import { ScrollButton } from './ScrollButton';
import React from 'react';

export function SanityTiles({
  value,
  scrollText,
  isRTLLocale,
  client,
}: {
  value: TilesSchemaType;
  scrollText: string;
  isRTLLocale?: boolean;
  client: SessionSanityClient;
}) {
  let variant: TILES_VARIANT;
  if (isTileVariant(value.variant)) {
    variant = value.variant;
  } else {
    console.warn('Invalid variant for tiles');
    variant = TILES_VARIANT.TEXT_OVERLAY_IMAGE;
  }

  const tiles = value.tiles;

  if (!tiles || !Array.isArray(tiles)) {
    console.warn('Missing tiles for tiles');
    return null;
  }

  const id = `${value._key}-tiles-scrollable`;
  const tileContainer = `${value._key}-tiles-scrollable-tile-container`;

  const isScrollableOnMobile =
    variant === TILES_VARIANT.TEXT_OVERLAY_IMAGE || tiles.length % 2 !== 0;

  return (
    <div
      id={id}
      className="relative my-4 flex flex-col items-start overflow-x-auto pb-1 md:pt-0"
      style={{
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {isScrollableOnMobile ? (
        <ScrollButton
          scrollText={scrollText}
          parentId={id}
          tileContainerId={tileContainer}
          isRTLLocale={isRTLLocale}
          className="absolute left-0 top-0 md:hidden"
        />
      ) : null}
      <div
        id={tileContainer}
        className={cn(
          'h-max gap-4',
          variant === TILES_VARIANT.TEXT_UNDER_IMAGE && tiles.length % 2 === 0
            ? 'grid grid-cols-2 md:flex md:flex-row'
            : 'flex flex-row'
        )}
      >
        {value?.tiles.map((tile) => (
          <SanityTile variant={variant} value={tile} client={client} key={tile._key} />
        ))}
      </div>
    </div>
  );
}
