/* globals spyOn */
const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const MemoryFileSystem = require('memory-fs');
const defaultSearchPatterns = require('../../src/config/defaultSearchPatterns');
const i18nSupportedLocales = require('../../src/config/i18nSupportedLocales');
const aggregateTranslations = require('../../src/aggregate-translations');

global.console = { warn: jest.fn(), log: jest.fn() };

const numOfDefaultSearchPatterns = defaultSearchPatterns.length;
const nestedOutputDir = './translations/folder';

jest.mock('react-intl', () => ({
  intlShape: {},
}));

describe('aggregate-translations', () => {
  let searchedDirectories;
  let globOptions;
  let writtenFilePaths;
  let fseSpy;
  let fseMakeDirSpy;
  let globSpy;

  beforeEach(() => {
    searchedDirectories = [];
    globOptions = null;
    writtenFilePaths = [];
    globSpy = spyOn(glob, 'sync').and.callFake((...args) => {
      searchedDirectories.push(args[0]);
      [, globOptions] = args;
      return args[0];
    });

    fseSpy = spyOn(fse, 'writeFileSync').and.callFake((fileName) => {
      writtenFilePaths.push(fileName);
    });

    fseMakeDirSpy = spyOn(fse, 'mkdirpSync');
  });

  it('aggregates on the default search patterns', () => {
    const supportedLocales = aggregateTranslations();

    expect(globSpy).toHaveBeenCalledTimes(numOfDefaultSearchPatterns);
    expect(searchedDirectories).toEqual(expect.arrayContaining(defaultSearchPatterns));

    expect(globSpy).toHaveBeenNthCalledWith(1, 'node_modules/*/node_modules/*/node_modules/*/translations', expect.anything());
    expect(globSpy).toHaveBeenNthCalledWith(7, 'translations', expect.anything());
    expect(supportedLocales).toEqual(i18nSupportedLocales);
  });

  it('aggregates on the default search patterns and custom directory patterns', () => {
    const directories = ['./test/*/pattern'];
    aggregateTranslations({ directories });

    expect(globSpy).toHaveBeenCalledTimes(numOfDefaultSearchPatterns + 1);
    expect(searchedDirectories).toEqual(expect.arrayContaining(directories));
  });

  it('aggregates on the default search patterns and custom directory patterns while excluding the custom excludes directory patterns', () => {
    const includePattern = './test/*/pattern';
    const excludePattern = './foo/*/bar';
    aggregateTranslations({ directories: [includePattern, excludePattern], excludes: [excludePattern] });

    expect(globSpy).toHaveBeenCalledTimes(numOfDefaultSearchPatterns + 2);
    expect(searchedDirectories).toEqual(expect.arrayContaining([includePattern]));
    expect(globOptions.ignore).toEqual([excludePattern]);
  });

  it('uses the custom base directory', () => {
    const baseDir = './fixtures';
    aggregateTranslations({ baseDir });

    expect(searchedDirectories).toEqual(defaultSearchPatterns);
    expect(globOptions.cwd).toEqual(baseDir);
  });

  it('uses the fs fileSystem for output by default', () => {
    aggregateTranslations();

    expect(fseSpy).toHaveBeenCalled();
  });

  it('uses the specified outputFileSystem', () => {
    const memoryFS = new MemoryFileSystem();
    const memoryFsSpy = spyOn(memoryFS, 'writeFileSync');
    spyOn(memoryFS, 'mkdirpSync');

    aggregateTranslations({ outputFileSystem: memoryFS });

    expect(memoryFsSpy).toHaveBeenCalled();
  });

  it('aggregates on the terra-supported locales by default', () => {
    const translationsFiles = [];
    i18nSupportedLocales.forEach(locale => translationsFiles.push(expect.stringContaining(`aggregated-translations${path.sep}${locale}.js`)));

    aggregateTranslations();

    expect(writtenFilePaths).toEqual(expect.arrayContaining(translationsFiles));
    const numSupportedLocales = i18nSupportedLocales.length;
    expect(writtenFilePaths.length).toEqual(numSupportedLocales);
  });

  it('aggregates on the specified locales', () => {
    const translationsFiles = [
      expect.stringContaining(`aggregated-translations${path.sep}en.js`),
    ];

    const supportedLocales = aggregateTranslations({ locales: ['en'] });

    expect(writtenFilePaths).toEqual(expect.arrayContaining(translationsFiles));
    expect(writtenFilePaths.length).toEqual(1);
    expect(supportedLocales).toEqual(['en']);
  });

  it('always aggregates on en locale even if not specified', () => {
    const translationsFiles = [
      `${process.cwd()}${path.sep}aggregated-translations${path.sep}en.js`,
      `${process.cwd()}${path.sep}aggregated-translations${path.sep}es.js`,
    ];

    const supportedLocales = aggregateTranslations({ locales: ['es'] });

    expect(writtenFilePaths).toEqual(expect.arrayContaining(translationsFiles));
    expect(writtenFilePaths.length).toEqual(2);
    expect(supportedLocales).toEqual(['es', 'en']);
  });

  it('writes to the default output directory', () => {
    const expectedOutputDir = expect.stringContaining(`${process.cwd()}${path.sep}aggregated-translations`);

    aggregateTranslations();

    expect(writtenFilePaths).toEqual(expect.arrayContaining([expectedOutputDir]));
  });

  it('writes to the provided output directory', () => {
    const expectedOutputDir = expect.stringContaining(`${process.cwd()}${path.sep}translations${path.sep}folder`);

    aggregateTranslations({ outputDir: nestedOutputDir });

    expect(fseMakeDirSpy).toHaveBeenCalledWith(expectedOutputDir);
    expect(writtenFilePaths).toEqual(expect.arrayContaining([expectedOutputDir]));
  });

  it('writes to the provided output directory with defined outputFileSystem', () => {
    const memoryFS = new MemoryFileSystem();
    spyOn(memoryFS, 'writeFileSync').and.callFake((fileName) => {
      writtenFilePaths.push(fileName);
    });
    const memoryFsMakeDirSpy = spyOn(memoryFS, 'mkdirpSync');

    const expectedOutputDir = expect.stringContaining(`${process.cwd()}${path.sep}translations${path.sep}folder`);

    aggregateTranslations({ outputDir: nestedOutputDir, outputFileSystem: memoryFS });

    expect(memoryFsMakeDirSpy).toHaveBeenCalledWith(expectedOutputDir);
    expect(writtenFilePaths).toEqual(expect.arrayContaining([expectedOutputDir]));
  });
});
