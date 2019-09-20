const path = require('path');
const ThemeAggregator = require('../../scripts/aggregate-themes/theme-aggregator');

global.console = { log: jest.fn(), warn: jest.fn() };

describe('Theme Aggregator', () => {
  describe('validate', () => {
    /* eslint-disable no-console */
    afterEach(() => {
      console.warn.mockClear();
      console.log.mockClear();
    });

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

    /* eslint-enable no-console */
  });

  describe('aggregate', () => {
    it('returns null if there is no terra-theme-config.js and no config passed by env var.', () => {
      const file = ThemeAggregator.aggregate();

      expect(file).toBeNull();
    });
  });

  describe('aggregateThemes', () => {
    it('returns null for an empty default theme and empty array scope theme', () => {
      const options = { theme: '', scoped: [] };

      const files = ThemeAggregator.aggregateThemes(options);
      expect(files).toBeNull();
    });

    it('returns null for an null default theme and null array scope theme', () => {
      const options = { theme: null, scoped: null };

      const files = ThemeAggregator.aggregateThemes(options);
      expect(files).toBeNull();
    });

    it('returns null for a null default theme and scope theme array containing null and a non existent theme.', () => {
      const options = { theme: null, scoped: [null, 'non-existent'] };

      const files = ThemeAggregator.aggregateThemes(options);
      expect(files).toBeNull();
    });

    it('returns null for a non existent default theme and empty scope theme', () => {
      const options = { theme: 'unknown-theme', scoped: '' };

      const files = ThemeAggregator.aggregateThemes(options);
      expect(files).toBeNull();
    });

    it('returns the aggregated scoped theme for a non existent default theme and defined scope theme', () => {
      const options = { theme: '', scoped: ['terra-mock-dark-theme'] };

      const files = ThemeAggregator.aggregateThemes(options);
      const expected = ['../tests/jest/fixtures/themes/terra-mock-dark-theme/scoped-theme.scss'];

      expect(files).toEqual(expected);
    });

    it('returns the aggregated default theme for a defined default theme and non existent scope theme', () => {
      const options = { theme: 'terra-mock-dark-theme', scoped: ['unkown-theme'] };

      const files = ThemeAggregator.aggregateThemes(options);
      const expected = ['../tests/jest/fixtures/themes/terra-mock-dark-theme/root-theme.scss'];

      expect(files).toEqual(expected);
    });

    it('returns the aggregated default theme for a defined default theme and empty scope theme', () => {
      const options = { theme: 'terra-mock-dark-theme', scoped: [] };

      const files = ThemeAggregator.aggregateThemes(options);
      const expected = ['../tests/jest/fixtures/themes/terra-mock-dark-theme/root-theme.scss'];

      expect(files).toEqual(expected);
    });
  });

  describe('aggregateTheme', () => {
    it('warns if a blank value is passed as a themename and returns null', () => {
      const files = ThemeAggregator.aggregateTheme('');

      expect(files).toEqual(null);
    });

    it('returns an array of aggregated default theme file paths', () => {
      const options = { theme: 'terra-mock-dark-theme' };

      const files = ThemeAggregator.aggregateTheme('terra-mock-dark-theme', options);
      const expected = ['../tests/jest/fixtures/themes/terra-mock-dark-theme/root-theme.scss'];

      expect(files).toEqual(expected);
    });

    it('returns an array of aggregated scoped theme files paths', () => {
      const options = { scoped: ['terra-mock-dark-theme'] };

      const files = ThemeAggregator.aggregateTheme('terra-mock-dark-theme', options);
      const expected = ['../tests/jest/fixtures/themes/terra-mock-dark-theme/scoped-theme.scss'];

      expect(files).toEqual(expected);
    });

    it('returns an array of aggregated scoped theme files paths, including themes within node_modules', () => {
      const options = { scoped: ['terra-mock-opaque-theme'] };

      const files = ThemeAggregator.aggregateTheme('terra-mock-opaque-theme', options);
      const expected = [
        'sample-component/themes/terra-mock-opaque-theme/scoped-theme.scss',
        '../tests/jest/fixtures/themes/terra-mock-opaque-theme/scoped-theme.scss',
      ];

      expect(files).toEqual(expected);
    });
  });

  describe('findThemeVariableFiles', () => {
    it("returns the requested theme's files", () => {
      const themeName = 'terra-mock-dark-theme';

      const files = ThemeAggregator.findThemeVariableFiles(themeName);
      const expected = ['tests/jest/fixtures/themes/terra-mock-dark-theme/terra-mock-dark-theme.scss'];

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
      const expected = 'terra-mock-dark-theme/root-file.scss';

      expect(resolvedFile).toEqual(expected);
    });

    it('resolves a relative file path', () => {
      const resolvedFile = ThemeAggregator.resolve('fixtures/themes/terra-mock-dark-theme/root-file.scss');
      const expected = '../fixtures/themes/terra-mock-dark-theme/root-file.scss';

      expect(resolvedFile).toEqual(expected);
    });
  });


  describe('writeSCSSFile', () => {
    it('returns the generated SCSS file path relative to the given output path.', () => {
      const theme = 'test-theme';

      const outputPath = path.resolve(process.cwd(), 'tests', 'jest', 'fixtures', 'generatedThemes');

      const scssFile = ThemeAggregator.writeSCSSFile({
        assets: [theme], themeName: theme, prefix: 'scoped', scopeSelector: theme, outputPath,
      });

      const expected = ['./scoped-test-theme.scss'];
      expect(scssFile).toEqual(expected);
    });
  });
});
