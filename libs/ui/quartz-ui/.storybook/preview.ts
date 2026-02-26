import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Import design tokens CSS variables
import '../../../design-tokens/src/generated/css/bundle.css';
import '../src/lib/Introduction.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Showcase', '*'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'Light Mode': 'light',
        'Dark Mode': 'dark',
      },
      defaultTheme: 'Light Mode',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
