const generateTranslationFile = require('../../scripts/aggregate-translations/generate-translation-file');

const locales = ['en', 'en-US'];

locales.forEach((locale) => {
  describe(`generate ${locale} translations file`, () => {
    let translationsFile;
    beforeAll(() => {
      const unsortedMessages = {
        'Terra.test.fixtures.test': 'Test...',
        'Terra.More.fixtures.test': 'Test...',
        'Terra.Fixtures1.test': 'Test...',
        'Terra.fixtures.test': 'Test...',
      };

      translationsFile = generateTranslationFile(locale, unsortedMessages);
    });

    it(`creates the compiled ${locale} translation file`, () => {
      expect(translationsFile).toMatchSnapshot();
    });

    it(`sorts the ${locale} translation messages`, () => {
      const sortedMessages = {
        'Terra.fixtures.test': 'Test...',
        'Terra.Fixtures1.test': 'Test...',
        'Terra.More.fixtures.test': 'Test...',
        'Terra.test.fixtures.test': 'Test...',
      };
      expect(translationsFile).toMatch(JSON.stringify(sortedMessages, null, 2));
    });
  });
});
