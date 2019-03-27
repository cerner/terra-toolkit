const defaultSearchPatterns = [
  /* root level translations */
  'translations',
  /* root level dependency translations up to three levels deep */
  'node_modules/*/translations',
  'node_modules/*/node_modules/*/translations',
  'node_modules/*/node_modules/*/node_modules/*/translations',
  /* package level translations */
  'packages/terra-*/translations',
  /* package level dependency translations up to three levels deep */
  'packages/*/node_modules/*/translations',
  'packages/*/node_modules/*/node_modules/*/translations',
  'packages/*/node_modules/*/node_modules/*/node_modules/*/translations',
];

module.exports = defaultSearchPatterns;
