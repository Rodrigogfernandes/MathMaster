import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'MathMaster',
  brandUrl: 'https://mathmaster.com',
  brandImage: '/logo.png',
  brandTarget: '_self',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e6e6e6',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#333333',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: '#0ea5e9',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e6e6e6',
  inputTextColor: '#333333',
  inputBorderRadius: 4,

  // Brand colors
  colorPrimary: '#0ea5e9',
  colorSecondary: '#64748b',

  // Status colors
  successColor: '#22c55e',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
});

addons.setConfig({
  theme,
  showPanel: true,
  panelPosition: 'bottom',
  enableShortcuts: true,
  showNav: true,
  showToolbar: true,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
}); 