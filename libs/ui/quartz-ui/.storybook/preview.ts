import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Import design tokens CSS variables
import '../../../design-tokens/src/generated/css/variables-light.css';
import '../../../design-tokens/src/generated/css/variables-dark.css';
import '../../../design-tokens/src/generated/css/variables-purple-light.css';
import '../../../design-tokens/src/generated/css/variables-purple-dark.css';

const preview: Preview = {
  parameters: {
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
        'Default Light': 'light',
        'Default Dark': 'dark',
        'Purple Light': 'purple-light',
        'Purple Dark': 'purple-dark',
      },
      defaultTheme: 'Default Light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
