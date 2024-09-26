import localFont from 'next/font/local';
import { Roboto_Flex } from 'next/font/google';

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

type FontPath = `${string}-${FontWeight}.${'ttf' | 'woff2'}`;
type FontSrc = Array<{
  path: FontPath;
  weight?: string;
  style?: string;
}>;

const RobotoFlex = Roboto_Flex({
  display: 'swap',
  subsets: ['latin-ext', 'cyrillic-ext', 'greek', 'vietnamese'],
  variable: '--font-roboto-flex',
});

const MonumentExtended = localFont({
  src: [
    {
      path: './MonumentExtended/MonumentExtended-Regular.woff2',
    },
  ] satisfies FontSrc,
  variable: '--font-monument-extended',
  display: 'swap',
});

export { RobotoFlex, MonumentExtended };
