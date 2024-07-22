import localFont from 'next/font/local';

type FontWeight =
  | 'Thin'
  | 'Light'
  | 'Regular'
  | 'Medium'
  | 'SemiBold'
  | 'Bold'
  | 'ThinItalic'
  | 'LightItalic'
  | 'Italic'
  | 'MediumItalic'
  | 'SemiBoldItalic'
  | 'BoldItalic';

type FontPath = `${string}-${FontWeight}.ttf`;

type FontSrc = Array<{
  path: FontPath;
  weight: string;
  style?: string;
}>;

const AtypDisplay = localFont({
  src: [
    {
      path: './AtypDisplay/AtypDisplay-Thin.ttf',
      weight: '100',
    },
    {
      path: './AtypDisplay/AtypDisplay-Light.ttf',
      weight: '300',
    },
    {
      path: './AtypDisplay/AtypDisplay-Regular.ttf',
      weight: '400',
    },
    {
      path: './AtypDisplay/AtypDisplay-Medium.ttf',
      weight: '500',
    },
    {
      path: './AtypDisplay/AtypDisplay-SemiBold.ttf',
      weight: '600',
    },
    {
      path: './AtypDisplay/AtypDisplay-Bold.ttf',
      weight: '700',
    },
    {
      path: './AtypDisplay/AtypDisplay-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './AtypDisplay/AtypDisplay-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './AtypDisplay/AtypDisplay-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './AtypDisplay/AtypDisplay-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './AtypDisplay/AtypDisplay-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './AtypDisplay/AtypDisplay-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ] satisfies FontSrc,
  variable: '--font-atyp-display',
  display: 'swap',
});

const AtypText = localFont({
  src: [
    {
      path: './AtypText/AtypText-Thin.ttf',
      weight: '100',
    },
    {
      path: './AtypText/AtypText-Light.ttf',
      weight: '300',
    },
    {
      path: './AtypText/AtypText-Regular.ttf',
      weight: '400',
    },
    {
      path: './AtypText/AtypText-Medium.ttf',
      weight: '500',
    },
    {
      path: './AtypText/AtypText-SemiBold.ttf',
      weight: '600',
    },
    {
      path: './AtypText/AtypText-Bold.ttf',
      weight: '700',
    },
    {
      path: './AtypText/AtypText-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './AtypText/AtypText-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './AtypText/AtypText-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './AtypText/AtypText-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './AtypText/AtypText-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './AtypText/AtypText-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ] satisfies FontSrc,
  variable: '--font-atyp-text',
  display: 'swap',
});

const MonumentExtended = localFont({
  src: [
    {
      path: './MonumentExtended/MonumentExtended-Regular.woff2',
    },
  ],
  variable: '--font-monument-extended',
  display: 'swap',
});

export { AtypDisplay, AtypText, MonumentExtended };
