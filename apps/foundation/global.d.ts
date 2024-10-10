import type en from './locales/en.json';
type Messages = typeof en;

declare global {
  // NOTE - For type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
