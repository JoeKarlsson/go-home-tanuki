import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                // Phaser.js globals
                Phaser: 'readonly',
                PIXI: 'readonly',
                p2: 'readonly',
            },
        },
        rules: {
            // Basic code quality rules
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-unused-vars': 'warn', // Changed to warning for game development
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
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'src/js/lib/', // Ignore third-party libraries
        ],
    },
];
