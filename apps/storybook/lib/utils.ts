import { withThemeByClassName } from '@storybook/addon-themes';
import type { StorybookConfig } from '@storybook/nextjs';
import type { Preview } from '@storybook/react';
import { dirname, join } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const defaultStorybookConfig = () => {
  return {
    stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
      getAbsolutePath('@storybook/addon-onboarding'),
      getAbsolutePath('@storybook/addon-links'),
      getAbsolutePath('@storybook/addon-essentials'),
      getAbsolutePath('@chromatic-com/storybook'),
      getAbsolutePath('@storybook/addon-interactions'),
    ],
    framework: {
      name: getAbsolutePath('@storybook/nextjs'),
      options: {},
    },
  };
};

export const createStorybookConfigFromDefault = (
  config?: Omit<StorybookConfig, 'framework' | 'addons' | 'stories'>
): StorybookConfig => {
  return {
    ...defaultStorybookConfig(),
    ...config,
  };
};

const defaultStorybookPreview = () => {
  return {
    parameters: {
      backgrounds: {
        default: 'dark',
        values: [
          {
            name: 'dark',
            value: '#000000',
          },
        ],
      },
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/i,
        },
      },
    },
  };
};

export const createStorybookPreviewFromDefault = (preview?: Preview): Preview => {
  return {
    ...defaultStorybookPreview(),
    ...preview,
  };
};

export const defaultStorybookDecorators = (): Array<any> => [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
  }),
];

export const createStorybookDecoratorsFromDefault = (decorators?: Array<any>): Array<any> => {
  return [...defaultStorybookDecorators(), ...(decorators ?? [])];
};
