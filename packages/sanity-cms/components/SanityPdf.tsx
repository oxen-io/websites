import { NavLink } from '@session/ui/components/NavLink';
import { LinkOutIcon } from '@session/ui/icons/LinkOutIcon';

export type SanityPdfProps = {
  src: string;
  strings: {
    openPdfInNewTab: string;
    openPdfInNewTabAria: string;
  };
};

export default function SanityPdf({ src, strings }: SanityPdfProps) {
  if (!src) return null;

  return (
    <main className="flex h-full min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4">
      <NavLink
        href={src}
        aria-label={strings.openPdfInNewTabAria}
        className="inline-flex items-center justify-center gap-2 align-middle"
      >
        {strings.openPdfInNewTab} <LinkOutIcon className="h-4 w-4" />
      </NavLink>
      <iframe
        src={src}
        className="h-full min-h-screen w-full"
        style={{ border: 'none' }}
        title="PDF"
      />
    </main>
  );
}
