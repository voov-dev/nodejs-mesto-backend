const prettierConfig = require('./.prettierrc');

module.exports = {
  env: {
    browser: true,
    es6: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  root: true,
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  rules: {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    curly: ['error', 'multi'],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        overrides: {
          constructors: 'no-public',
        },
      },
    ],
    '@typescript-eslint/semi': ['error'],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    '@typescript-eslint/no-var-requires': ['warn'],
    '@typescript-eslint/ban-types': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': ['warn'],
    complexity: ['error', 5],
    'prettier/prettier': ['error', prettierConfig],
    'react-hooks/exhaustive-deps': ['off'],
  },
};
