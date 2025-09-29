module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        // Basic code quality rules
        'no-console': 'warn',
        'no-debugger': 'warn',
        'no-unused-vars': 'warn',
        'no-undef': 'error',

        // Code style rules
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'no-trailing-spaces': 'error',
        'eol-last': 'error',

        // Best practices
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',

        // Phaser.js specific allowances
        'no-global-assign': 'off', // Allow Phaser global
    },
    globals: {
        // Phaser.js globals
        'Phaser': 'readonly',
        'PIXI': 'readonly',
        'p2': 'readonly',
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'src/js/lib/', // Ignore third-party libraries
    ],
};
