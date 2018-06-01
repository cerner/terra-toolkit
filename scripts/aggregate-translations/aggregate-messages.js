const path = require('path');
const fs = require('fs');

const aggregateTranslationMessages = (translationDirectories, locales) => {
  const translations = {};
  locales.forEach((language) => {
    translations[language] = {};
  });

  translationDirectories.forEach(dir =>
    // Check the directory for a translation file for each locale
    locales.forEach((language) => {
      const translationFile = path.resolve(dir, `${language}.json`);
      try {
        Object.assign(translations[language], JSON.parse(fs.readFileSync(translationFile, 'utf8')));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`There was an error reading your translations file ${translationFile}.\n Exception Message: ${e.message} \n`);
      }
    }),
  );

  return translations;
};

module.exports = aggregateTranslationMessages;
