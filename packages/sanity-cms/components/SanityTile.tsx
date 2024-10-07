import type { TileSchemaType } from '../schemas/fields/component/tile';
import { SanityImage } from './SanityImage';
import type { SessionSanityClient } from '../lib/client';
import { cn } from '@session/ui/lib/utils';
import { TILES_VARIANT } from '../schemas/fields/component/tiles';

export function SanityTile({
  value,
  variant,
  client,
}: {
  value: TileSchemaType;
  variant: TILES_VARIANT;
  client: SessionSanityClient;
}) {
  switch (variant) {
    case TILES_VARIANT.TEXT_OVERLAY_IMAGE:
      return <SanityTileTextOnTopOfImage value={value} client={client} />;
    case TILES_VARIANT.TEXT_UNDER_IMAGE:
      return <SanityTileTextUnderImage value={value} client={client} />;
    default:
      console.warn('Invalid variant for tile');
      return null;
  }
}

export function SanityTileTextOnTopOfImage({
  value,
  client,
}: {
  value: TileSchemaType;
  client: SessionSanityClient;
}) {
  if (!value.image) {
    console.warn('Missing image for tile');
    return null;
  }

  return (
    <div
      className={cn(
        'group',
        'flex h-full w-60 flex-col rounded-2xl border border-gray-200 shadow-md',
        'text-session-white relative h-80 items-center justify-center gap-2 overflow-hidden p-6 text-center',
        'transition-all duration-300 ease-in-out motion-reduce:transition-none'
      )}
    >
      <strong className="text-lg font-semibold [text-shadow:_0_0_8px_var(--session-black)] md:text-xl">
        {value.title}
      </strong>
      <p
        className={cn(
          'hidden text-sm md:text-base',
          'group-hover:block',
          'group-active:block',
          'transition-all duration-300 ease-in-out motion-reduce:transition-none'
        )}
        style={{
          // For some reason using leading-tight gets overriden so this is needed
          lineHeight: 1.25,
        }}
      >
        {value.description}
      </p>
      <SanityImage
        client={client}
        value={value.image}
        isInline={false}
        cover
        className={cn(
          'absolute inset-0 -z-10 h-full w-full rounded-2xl',
          'group-hover:darken group-hover:blur-sm group-hover:brightness-50',
          'group-active:darken group-active:blur-sm group-active:brightness-50',
          'transition-all duration-300 ease-in-out motion-reduce:transition-none'
        )}
      />
    </div>
  );
}

export function SanityTileTextUnderImage({
  value,
  client,
}: {
  value: TileSchemaType;
  client: SessionSanityClient;
}) {
  if (!value.image) {
    console.warn('Missing image for tile');
    return null;
  }
  return (
    <div className="flex h-max w-full flex-col gap-1">
      <SanityImage
        client={client}
        value={value.image}
        cover
        isInline={false}
        className="h-60 w-full rounded-2xl border border-gray-200 shadow-md"
      />
      <span className="ms-2 text-sm md:text-base">{value.title}</span>
      <span className="ms-2 text-xs font-light md:text-sm">{value.description ?? ' '}</span>
    </div>
  );
}
