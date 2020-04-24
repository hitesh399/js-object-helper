module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        window: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        document: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        indent: ['error', 4],
        'no-var': 2,
        semi: [2, 'always'],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        camelcase: 2,
        'no-duplicate-case': 2,
        'no-dupe-else-if': 2,
        'no-prototype-builtins': 0,
    },
};
