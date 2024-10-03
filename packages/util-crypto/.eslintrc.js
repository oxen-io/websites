/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@session/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
