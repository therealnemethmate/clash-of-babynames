/* eslint-env node */
/** @type {import('eslint').Linter.Config} */

import js from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';
import ts from 'typescript-eslint';

const { es2021, node, browser } = globals;

export default [
    js.configs.recommended,
    ...vue.configs['flat/recommended'],
    ...ts.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...es2021,
                ...node,
                ...browser,
            },
            parser: vueParser,
            parserOptions: {
                parser: ts.parser,
            },
        },
        plugins: {
            'simple-import-sort': simpleImportSort,
            'vue': vue,
        },
        files: ['**/*.ts', '**/*.vue'],
        rules: {
            'vue/html-indent': ['error', 4],
            'array-bracket-spacing': ['error', 'never'],
            'array-element-newline': ['error', 'consistent'],
            'arrow-spacing': ['error', { before: true, after: true }],
            'arrow-parens': ['error', 'always'],
            'block-spacing': ['error', 'always'],
            'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': ['error', { before: false, after: true }],
            'comma-style': ['error', 'last'],
            'computed-property-spacing': ['error', 'never'],
            'default-case-last': ['error'],
            'dot-location': ['error', 'property'],
            'func-call-spacing': ['error', 'never'],
            'function-call-argument-newline': ['error', 'consistent'],
            'eol-last': ['error', 'always'],
            'indent': ['error', 4],
            'key-spacing': ['error', { mode: 'strict' }],
            'keyword-spacing': ['error', { before: true, after: true }],
            'linebreak-style': ['error', 'unix'],
            'no-multi-spaces': 'error',
            'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
            'no-nested-ternary': 'error',
            'no-new-object': 'error',
            'no-new-wrappers': 'error',
            'no-octal-escape': 'error',
            'no-return-await': 'error',
            'no-tabs': 'error',
            'no-throw-literal': 'error',
            'no-whitespace-before-property': 'error',
            'object-curly-spacing': ['error', 'always'],
            'operator-linebreak': ['error', 'before'],
            'padded-blocks': ['error', 'never'],
            'prefer-promise-reject-errors': 'error',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',
            'quote-props': ['error', 'consistent-as-needed'],
            'quotes': ['error', 'single'],
            'rest-spread-spacing': ['error', 'never'],
            'semi': ['error', 'always'],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'off',
            'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
            'template-curly-spacing': ['error', 'never'],
        },
    },
    {
        ignores: [
            '**/*.config.ts',
            '**/*.d.ts',
            '**/*.js',
            '**/*.cjs',
            '**/*.mjs',
            '**/*.json',
            'node_modules',
        ],
    },
];
