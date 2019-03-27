const path = require('path');
const Logger = require('../utils/logger');

const aggregateTranslationMessages = (translationDirectories, locales, fileSystem) => {
  const translations = {};
  locales.forEach((language) => {
    translations[language] = {};
  });

  translationDirectories.forEach(dir => locales.forEach((language) => {
    // Check the directory for a translation file for each locale
    const translationFile = path.resolve(dir, `${language}.json`);
    try {
      Object.assign(translations[language], JSON.parse(fileSystem.readFileSync(translationFile, 'utf8')));
    } catch (e) {
      Logger.warn(`There was an error reading your translations file ${translationFile}.\n Exception Message: ${e.message} \n`);
    }
  }));

  return translations;
};

module.exports = aggregateTranslationMessages;
