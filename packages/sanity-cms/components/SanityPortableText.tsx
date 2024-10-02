import { PortableText, type PortableTextProps } from '@portabletext/react';
import { NavLink } from '@session/ui/components/NavLink';

export type SanityPortableTextProps = PortableTextProps;

type BasicComponentsType = PortableTextProps['components'] & {
  block: NonNullable<PortableTextProps['components']>['block'];
  marks: NonNullable<PortableTextProps['components']>['marks'];
};

export const basicComponents: BasicComponentsType = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-3 mt-7 text-3xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-5 text-xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-4 text-lg font-bold">{children}</h4>,
    h5: ({ children }) => <h5 className="mt-3 text-lg font-bold">{children}</h5>,
    h6: ({ children }) => <h6 className="mt-3 text-base font-bold">{children}</h6>,
    li: ({ children }) => <li className="list-disc">{children}</li>,
    ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
    ul: ({ children }) => <ul className="list-disc">{children}</ul>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  marks: {
    link: ({ children, value }) => <NavLink href={value.href}>{children}</NavLink>,
  },
};

export function SanityPortableText(props: SanityPortableTextProps) {
  return <PortableText components={basicComponents} {...props} />;
}
