const webpackEntries = require('../../../../config/webpack/webpack.entries');

describe('webpack entries', () => {
  describe('dev or prod config', () => {
    it('add the polyfills as default entries', () => {
      const entries = webpackEntries();
      expect(entries).toMatchObject({
        raf: 'raf/polyfill',
        'core-js': 'core-js/stable',
        'regenerator-runtime': 'regenerator-runtime/runtime',
      });
    });
  });
});
