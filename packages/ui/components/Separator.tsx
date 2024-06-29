type TextSeparatorProps = {
  separator: string;
  className?: string;
};

export const TextSeparator = ({ separator = '|', className }: TextSeparatorProps) => (
  <span className={className}> {separator} </span>
);
