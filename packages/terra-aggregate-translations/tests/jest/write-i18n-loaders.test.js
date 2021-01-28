/* globals spyOn */
const fse = require('fs-extra');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const MemoryFileSystem = require('memory-fs');
const writeI18nLoaders = require('../../src/write-i18n-loaders');

global.console = { warn: jest.fn() };

const locales = ['en', 'en-US', 'es'];
const memoryFS = new MemoryFileSystem();
const testFileSystems = { fse, memoryFS };

Object.keys(testFileSystems).forEach((testFS) => {
  describe(`write compiled i18n loaders for ${testFS} fileSystem`, () => {
    const fileSystem = testFileSystems[testFS];
    const outputDir = '/aggregated-translations';
    let writtenFilePaths;
    let writtenFiles;
    beforeEach(() => {
      writtenFilePaths = [];
      writtenFiles = [];
      spyOn(fileSystem, 'writeFileSync').and.callFake((fileName, hash) => {
        writtenFilePaths.push(fileName);
        writtenFiles.push(hash);
      });
      // eslint-disable-next-line no-console
      console.warn.mockClear();
    });

    it('writes compiled loader files', () => {
      const outputFiles = [
        path.resolve(process.cwd(), outputDir, 'intlLoaders.js'),
        path.resolve(process.cwd(), outputDir, 'translationsLoaders.js'),
      ];

      writeI18nLoaders(locales, fileSystem, outputDir);

      expect(writtenFilePaths).toEqual(outputFiles);
      expect(writtenFiles[0]).toMatchSnapshot();
      expect(writtenFiles[1]).toMatchSnapshot();
      expect(writtenFiles[2]).toMatchSnapshot();
    });

    it('writes compiled loader files with modern format if specified', () => {
      const outputFiles = [
        path.resolve(process.cwd(), outputDir, 'intlLoaders.js'),
        path.resolve(process.cwd(), outputDir, 'translationsLoaders.js'),
      ];

      writeI18nLoaders(locales, fileSystem, outputDir, 'es6');

      expect(writtenFilePaths).toEqual(outputFiles);
      expect(writtenFiles[0]).toMatchSnapshot();
      expect(writtenFiles[1]).toMatchSnapshot();
      expect(writtenFiles[2]).toMatchSnapshot();
    });

    it('logs a warning message if a locale is not a terra-supported locale', () => {
      writeI18nLoaders(['cy'], fileSystem, outputDir);

      /* eslint-disable no-console */
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toBeCalledWith(expect.stringContaining('WARNING: cy is NOT a Terra supported locale. Creating a translation and intl loader for cy, but'));
      /* eslint-enable no-console */
    });

    it('writes a translation file for a non-terra-supported locale', () => {
      writeI18nLoaders(['cy'], fileSystem, outputDir);

      expect(writtenFiles[0]).toMatchSnapshot();
      expect(writtenFiles[1]).toMatchSnapshot();
      expect(writtenFiles[2]).toMatchSnapshot();
    });
  });
});
