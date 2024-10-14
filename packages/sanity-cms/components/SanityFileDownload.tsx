'use client';

import SanityPdf from './SanityPdf';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cleanSanityString } from '../lib/string';

type FileDownloadProps = {
  fileName: string;
  src: string;
  strings: {
    fetching: string;
    clickToDownload: string;
    clickToDownloadAria: string;
    openPdfInNewTab: string;
    openPdfInNewTabAria: string;
  };
};

export default function FileDownload({ fileName, src, strings }: FileDownloadProps) {
  const [downloaded, setDownloaded] = useState(false);
  const router = useRouter();
  if (!src || !fileName) return null;

  const name = cleanSanityString(fileName);
  const srcWithParams = new URL(src);
  srcWithParams.searchParams.set('dl', name);

  if (src.includes('.pdf')) {
    return <SanityPdf src={src} url={srcWithParams} strings={strings} />;
  }

  // Download file on mount
  useEffect(() => {
    if (!downloaded) {
      setDownloaded(true);
      void router.push(srcWithParams.href);
    }
  }, [src]);

  return (
    <div className="my-12 flex flex-col items-center justify-center gap-2">
      <p className="text-center text-sm">{strings.fetching.replace('{name}', fileName)}</p>
      <a
        href={srcWithParams.href}
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
