import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, Phaser: 'readonly', PIXI: 'readonly' }
    },
    rules: {
      'no-unused-vars': 'warn',
      eqeqeq: ['error', 'always'],
      'no-implied-eval': 'error'
    }
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.mjs', '*.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } }
  },
  {
    ignores: ['node_modules/', 'dist/', 'public/', 'test-results/', 'playwright-report/']
  }
];
