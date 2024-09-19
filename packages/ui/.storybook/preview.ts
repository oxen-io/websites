import {
  createStorybookDecoratorsFromDefault,
  createStorybookPreviewFromDefault,
} from '@session/storybook/lib/utils';
import '../styles/global.css';

export const decorators = createStorybookDecoratorsFromDefault();
const preview = createStorybookPreviewFromDefault();

export default preview;
