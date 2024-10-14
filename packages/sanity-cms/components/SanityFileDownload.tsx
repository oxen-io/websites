import SanityPdf from './SanityPdf';

type FileDownloadProps = {
  src: string;
  strings: {
    fetching: string;
    clickToDownload: string;
    clickToDownloadAria: string;
    openPdfInNewTab: string;
    openPdfInNewTabAria: string;
  };
};

export default function FileDownload({ src, strings }: FileDownloadProps) {
  if (!src) return null;

  if (src.endsWith('.pdf')) {
    return <SanityPdf src={src} strings={strings} />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-center text-sm">{strings.fetching}</p>
      <a
        href={src}
        className="group"
        target="_blank"
        rel="noopener noreferrer"
        download
        aria-label={strings.clickToDownloadAria}
      >
        <button className="group-hover:decoration-session-green hover:decoration-session-green decoration-session-black mt-1 w-max text-sm underline group-hover:underline">
          {strings.clickToDownload}
        </button>
      </a>
    </div>
  );
}
