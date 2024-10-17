import {
  createStorybookDecoratorsFromDefault,
  createStorybookPreviewFromDefault,
} from '../lib/utils';

export const decorators = createStorybookDecoratorsFromDefault();
const preview = createStorybookPreviewFromDefault();

export default preview;
