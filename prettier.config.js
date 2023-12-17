/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  importOrder: [
    '^@core/(.*)$',
    '^@server/(.*)$',
    '^@ui/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
