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
      const [baseLocale, region] = locale.split('-');
      let mergedMessages = messages;

      if (region) {
        const baseLocaleMessages = aggregatedMessages[baseLocale];
        if (baseLocaleMessages) {
          Object.keys(baseLocaleMessages).forEach((key) => {
            if (messages[key] === undefined) {
              Logger.warn(`${locale} translation missing for ${key}, ${baseLocale} translation string will be used instead.`);
            }
          });

          // Merge base locale messages into regional locale messages, regional locale messages listed last so they will take precedence.
          mergedMessages = Object.assign({}, baseLocaleMessages, messages);
        }
      }
      fileSystem.writeFileSync(translationFilePath, generateTranslationFile(locale, mergedMessages));
    } else {
      throw Logger.error(`Translations aggregated for ${locale} locale, but messages were not loaded correctly. Please check that your translated modules were installed correctly.`);
    }
  });
};

module.exports = writeAggregatedTranslations;
