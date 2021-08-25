/* globals spyOn */
const fse = require('fs-extra');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const MemoryFileSystem = require('memory-fs');
const writeAggregatedTranslations = require('../../src/write-aggregated-translations');

global.console = { warn: jest.fn() };

const defaultMessages = { en: {}, 'en-US': {}, es: {} };
const locales = ['en', 'en-US', 'es'];
const memoryFS = new MemoryFileSystem();
const testFileSystems = { fse, memoryFS };

Object.keys(testFileSystems).forEach((testFS) => {
  describe(`write compiled aggregated translations for ${testFS} fileSystem`, () => {
    const fileSystem = testFileSystems[testFS];
    const outputDir = '/aggregated-translations';
    let writtenFiles;
    let fileContent;
    beforeEach(() => {
      writtenFiles = [];
      fileContent = {};
      spyOn(fileSystem, 'writeFileSync').and.callFake((fileName, hash) => {
        writtenFiles.push(fileName);
        fileContent[fileName] = hash;
        return hash;
      });
    });

    it('writes compiled translations files', () => {
      const outputFiles = [
        path.resolve(process.cwd(), outputDir, 'en.js'),
        path.resolve(process.cwd(), outputDir, 'en-US.js'),
        path.resolve(process.cwd(), outputDir, 'es.js'),
      ];

      writeAggregatedTranslations(defaultMessages, locales, fileSystem, outputDir);
      expect(writtenFiles).toEqual(outputFiles);
    });

    it('merges missing translations from base locale', () => {
      const testMessages = { en: { 'Terra.test.fixtures.test': 'Test...' }, 'en-AU': {} };
      const testLocales = ['en', 'en-AU'];

      const expectedOutput = { 'Terra.test.fixtures.test': 'Test...' };

      const outputFile = path.resolve(process.cwd(), outputDir, 'en-AU.js');

      writeAggregatedTranslations(testMessages, testLocales, fileSystem, outputDir);
      expect(fileContent[outputFile]).toMatch(JSON.stringify(expectedOutput, null, 2));
    });

    it('base locale does not overwrite regional locale translations', () => {
      const testMessages = { en: { 'Terra.test.fixtures.test': 'Test...' }, 'en-AU': { 'Terra.test.fixtures.test': 'en-AU test' } };
      const testLocales = ['en', 'en-AU'];

      const expectedOutput = { 'Terra.test.fixtures.test': 'en-AU test' };

      const outputFile = path.resolve(process.cwd(), outputDir, 'en-AU.js');

      writeAggregatedTranslations(testMessages, testLocales, fileSystem, outputDir);
      expect(fileContent[outputFile]).toMatch(JSON.stringify(expectedOutput, null, 2));
    });

    it('throws an error if a locale was not aggregated on', () => {
      const errorRegex = /Translations aggregated for es locale, but messages were not loaded correctly./;
      expect(() => writeAggregatedTranslations({ en: {}, 'en-US': {} }, locales, fileSystem, outputDir)).toThrowError(errorRegex);
    });

    it('logs a warning message if a locale is not a terra-supported locale', () => {
      writeAggregatedTranslations({ cy: {} }, ['cy'], fileSystem, outputDir);

      // eslint-disable-next-line no-console
      expect(console.warn).toBeCalledWith(expect.stringContaining('WARNING: cy is NOT a Terra supported locale. Creating an aggregate translation file for cy, but'));
    });

    it('writes a compiled translation file for a non-terra-supported locale', () => {
      const outputFiles = [
        path.resolve(process.cwd(), outputDir, 'cy.js'),
      ];

      writeAggregatedTranslations({ cy: {} }, ['cy'], fileSystem, outputDir);
      expect(writtenFiles).toEqual(outputFiles);
    });
  });
});
