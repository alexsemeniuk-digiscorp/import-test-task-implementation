const mainConfig = require('@bn-digital/prettier-config');

module.exports = {
  ...mainConfig,
  printWidth: 80,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'lf',
  organizeImportsSkipDestructiveCodeActions: false,
  plugins: ['prettier-plugin-organize-imports'],
};
