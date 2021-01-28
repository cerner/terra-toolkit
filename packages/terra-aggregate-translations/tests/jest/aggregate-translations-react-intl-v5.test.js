/* globals spyOn */
const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');
const i18nSupportedLocales = require('../../src/config/i18nSupportedLocales');
const aggregateTranslations = require('../../src/aggregate-translations');

global.console = { warn: jest.fn(), log: jest.fn() };

jest.mock('react-intl', () => ({
  intlShape: undefined,
}));

describe('aggregate-translations', () => {
  let writtenFilePaths;

  beforeEach(() => {
    const searchedDirectories = [];
    writtenFilePaths = [];
    spyOn(glob, 'sync').and.callFake((...args) => {
      searchedDirectories.push(args[0]);
      return args[0];
    });

    spyOn(fse, 'writeFileSync').and.callFake((fileName) => {
      writtenFilePaths.push(fileName);
    });

    spyOn(fse, 'mkdirpSync');
  });

  it('does not write i18n loaders when intlShape is undefined', () => {
    const loaderFiles = [
      `${process.cwd()}${path.sep}aggregated-translations${path.sep}intlLoaders.js`,
      `${process.cwd()}${path.sep}aggregated-translations${path.sep}translationsLoaders.js`,
    ];

    aggregateTranslations();

    expect(writtenFilePaths).toEqual(expect.not.arrayContaining(loaderFiles));
    const numSupportedLocales = i18nSupportedLocales.length;
    expect(writtenFilePaths.length).toEqual(numSupportedLocales);
  });
});
