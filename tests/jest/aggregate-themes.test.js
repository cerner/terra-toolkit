const ThemeAggregator = require('../../scripts/aggregate-themes/theme-aggregator');

global.console = { log: jest.fn(), warn: jest.fn() };


describe('Theme Aggregator', () => {
  describe('aggregate', () => {
    it('returns null if there is no terra-theme-config.js', () => {
      const file = ThemeAggregator.aggregate();

      expect(file).toBeNull();
    });
  });

  describe('aggregateTheme', () => {
    it('returns an array of aggregated default theme files', () => {
      const options = { theme: 'terra-mock-dark-theme' };

      const files = ThemeAggregator.aggregateTheme('terra-mock-dark-theme', options);
      const expected = ['tests/jest/fixtures/themes/terra-mock-dark-theme/root-theme.scss'];

      expect(files).toEqual(expected);
    });

    it('returns an array of aggregated scoped theme files', () => {
      const options = { scoped: ['terra-mock-dark-theme'] };

      const files = ThemeAggregator.aggregateTheme('terra-mock-dark-theme', options);
      const expected = ['tests/jest/fixtures/themes/terra-mock-dark-theme/scoped-theme.scss'];

      expect(files).toEqual(expected);
    });
  });

  describe('find', () => {
    it('returns the requested files', () => {
      const options = {};

      const file = ThemeAggregator.find('./tests/**/root-theme.scss', options);

      const expected = [
        './tests/jest/fixtures/themes/terra-mock-dark-theme/root-theme.scss',
        './tests/jest/fixtures/themes/terra-mock-light-theme/root-theme.scss',
      ];

      expect(file).toEqual(expected);
    });

    it('returns the requested directory', () => {
      const options = {};

      const file = ThemeAggregator.find('./tests/**/themes/terra-mock-dark-theme/', options).pop();

      expect(file).toEqual('./tests/jest/fixtures/themes/terra-mock-dark-theme/');
    });

    it('returns an empty array if no match was found', () => {
      const options = {};

      const file = ThemeAggregator.find('./tests/**/themes/terra-mock-lowlight-theme/*.scss', options);

      expect(file).toEqual([]);
    });

    it('returns the requested files excluding the specified file', () => {
      const options = { exclude: './tests/jest/fixtures/themes/terra-mock-dark-theme/root-theme.scss' };

      const file = ThemeAggregator.find('./tests/**/root-theme.scss', options);

      const expected = [
        './tests/jest/fixtures/themes/terra-mock-light-theme/root-theme.scss',
      ];

      expect(file).toEqual(expected);
    });
  });

  describe('resolve', () => {
    it('resolves a file path from the node_modules directory', () => {
      const resolvedFile = ThemeAggregator.resolve('node_modules/terra-mock-dark-theme/root-file.scss');

      expect(resolvedFile).toEqual('terra-mock-dark-theme/root-file.scss');
    });

    it('resolves a relative file path', () => {
      const resolvedFile = ThemeAggregator.resolve('./fixtures/themes/terra-mock-dark-theme/root-file.scss');

      expect(resolvedFile).toEqual('fixtures/themes/terra-mock-dark-theme/root-file.scss');
    });
  });

  describe('validate', () => {
    it('does not warn if there is a default theme but not a scoped theme', () => {
      const options = { theme: 'terra-mock-dark-theme' };

      ThemeAggregator.validate(options);

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    it('does not warn if there is a scoped theme but not a default theme', () => {
      const options = { scoped: ['terra-mock-dark-theme'] };

      ThemeAggregator.validate(options);

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    it('warns if there is not a default theme or a scoped theme', () => {
      const options = {};

      ThemeAggregator.validate(options);

      expect(console.warn).toHaveBeenCalled();
    });
  });
});
