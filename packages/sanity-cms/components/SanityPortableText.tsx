import { PortableText, type PortableTextProps } from '@portabletext/react';
import { NavLink } from '@session/ui/components/NavLink';
import logger from '../lib/logger';
import { cn } from '@session/ui/lib/utils';
import Typography from '@session/ui/components/Typography';
import { cleanSanityString } from '../lib/string';

export type SanityPortableTextProps = PortableTextProps & {
  className?: string;
  wrapperComponent?: 'div' | 'main' | 'section' | 'article';
};

type BasicComponentsType = PortableTextProps['components'] & {
  block: NonNullable<PortableTextProps['components']>['block'];
  marks: NonNullable<PortableTextProps['components']>['marks'];
};

export const basicComponents: BasicComponentsType = {
  block: {
    h1: ({ children }) => <Typography variant="h1">{children}</Typography>,
    h2: ({ children }) => (
      <Typography variant="h2" className="mb-3 mt-7">
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h3" className="mt-5">
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography variant="h4" className="mt-4">
        {children}
      </Typography>
    ),
    h5: ({ children }) => (
      <Typography variant="h5" className="mt-3">
        {children}
      </Typography>
    ),
    h6: ({ children }) => (
      <Typography variant="h6" className="mt-3">
        {children}
      </Typography>
    ),
    li: ({ children }) => <Typography variant="li">{children}</Typography>,
    ol: ({ children }) => <Typography variant="ol">{children}</Typography>,
    ul: ({ children }) => <Typography variant="ul">{children}</Typography>,
    strong: ({ children }) => <Typography variant="strong">{children}</Typography>,
    em: ({ children }) => <Typography variant="em">{children}</Typography>,
  },
  marks: {
    link: ({ children, value }) => (
      <NavLink href={value.href} unStyled className="text-session-green-link hover:underline">
        {children}
      </NavLink>
    ),
    'big-bold': ({ children }) => (
      <Typography variant="strong" className="text-lg md:text-xl">
        {children}
      </Typography>
    ),
  },
};

export function SanityPortableText({ value, className, ...props }: SanityPortableTextProps) {
  const blocks = [];

  if (!Array.isArray(value)) {
    logger.error('SanityPortableText: value is not an array');
    return null;
  }
  for (const block of value) {
    if (block._type === 'block' && 'children' in block && block.children.length === 1) {
      /**
       * Remove empty blocks from the array
       */
      const child = block.children[0];
      if (
        child &&
        '_type' in child &&
        child._type === 'span' &&
        'text' in child &&
        typeof child.text === 'string' &&
        cleanSanityString(child.text) === ''
      ) {
        continue;
      }
    } else if (blocks.length < 3 && block._type === 'image') {
      // Prioritize images in the first 5 blocks of the content
      // @ts-expect-error - This is a workaround to make TS happy
      block.priority = true;
    }
    blocks.push(block);
  }

  const Comp = props.wrapperComponent || 'div';

  return (
    <Comp
      className={cn(
        'flex flex-col items-start text-sm md:text-base [&>p]:mt-3.5 first:[&>p]:mt-0',
        className
      )}
    >
      <PortableText components={basicComponents} value={blocks} {...props} />
    </Comp>
  );
}
