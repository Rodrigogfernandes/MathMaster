import { themes } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/styles/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    expanded: true,
    hideNoControlsWarning: true,
  },
  darkMode: {
    dark: { ...themes.dark },
    light: { ...themes.normal },
    current: 'light',
    stylePreview: true,
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'responsive',
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#ffffff',
      },
      {
        name: 'dark',
        value: '#1a1a1a',
      },
      {
        name: 'twitter',
        value: '#00aced',
      },
      {
        name: 'facebook',
        value: '#3b5998',
      },
    ],
  },
  layout: 'centered',
  docs: {
    source: {
      language: 'jsx',
      format: true,
      type: 'code',
    },
    description: {
      component: null,
    },
  },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Getting Started',
        'Design System',
        ['Colors', 'Typography', 'Layout', 'Components'],
        'Pages',
        'Features',
      ],
    },
  },
  a11y: {
    element: '#root',
    manual: false,
    config: {
      rules: [
        {
          id: 'color-contrast',
          enabled: true,
        },
      ],
    },
  },
};

export const decorators = [
  (Story) => (
    <div style={{ margin: '3em' }}>
      <Story />
    </div>
  ),
]; 