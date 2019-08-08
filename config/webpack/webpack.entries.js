const webpackEntries = (themeFile) => {
  return {
    raf: 'raf/polyfill',
    'core-js': 'core-js/stable',
    'regenerator-runtime': 'regenerator-runtime/runtime',
    ...themeFile && { theme: themeFile },
  };
};

module.exports = webpackEntries;
