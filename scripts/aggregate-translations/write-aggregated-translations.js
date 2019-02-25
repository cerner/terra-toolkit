const path = require('path');
const supportedLocales = require('./i18nSupportedLocales');
const generateTranslationFile = require('./generate-translation-file');
const Logger = require('../utils/logger');

const writeAggregatedTranslations = (aggregatedMessages, locales, fileSystem, outputDir) => {
  // Create a file of aggregated translation messages for each locale
  locales.forEach((locale) => {
    if (locale in aggregatedMessages) {
      if (!supportedLocales.includes(locale)) {
        Logger.warn(`WARNING: ${locale} is NOT a Terra supported locale. Creating an aggregate translation file for ${locale}, but be sure to include the appropriate translations messages for each terra component used in your application otherwise the translations will fail and the fallback will be displayed.`);
      }

      const translationFilePath = path.resolve(outputDir, `${locale}.js`);
      const messages = aggregatedMessages[locale];
      const localeRegionSplit = locale.split('-');
      let mergedMessages = messages;

      // Check if this is a regional locale
      if (localeRegionSplit.length > 1) {
        const localeMessages = aggregatedMessages[localeRegionSplit[0]];
        if (localeMessages) {
          Object.keys(localeMessages).forEach((key) => {
            if (!messages[key]) {
              Logger.warn(`${locale} translations missing for ${key}, ${localeRegionSplit[0]} translation string will be used instead.`);
            }
          });
        }
        mergedMessages = Object.assign({}, localeMessages, messages);
      }
      fileSystem.writeFileSync(translationFilePath, generateTranslationFile(locale, mergedMessages));
    } else {
      throw Logger.error(`Translations aggregated for ${locale} locale, but messages were not loaded correctly. Please check that your translated modules were installed correctly.`);
    }
  });
};

module.exports = writeAggregatedTranslations;
