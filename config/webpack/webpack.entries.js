const ThemeAggregator = require('../../scripts/aggregate-themes/theme-aggregator');

const webpackEntries = () => {
  const themeFile = ThemeAggregator.aggregate();

  return {
    raf: 'raf/polyfill',
    'core-js': 'core-js/stable',
    'regenerator-runtime': 'regenerator-runtime/runtime',
    ...themeFile && { theme: themeFile },
  };
};

module.exports = webpackEntries;
