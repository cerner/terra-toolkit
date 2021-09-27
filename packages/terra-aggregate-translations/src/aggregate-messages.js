const path = require('path');
const chalk = require('chalk');

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
      // Only warn if the JSON is invalid or if the base language is missing
      if (e instanceof SyntaxError) {
        /* eslint-disable-next-line no-console */
        console.warn(chalk.yellow(`There was an error reading your translations file ${translationFile}.\n Exception Message: ${e.message} \n`));
      } else if (language.split('-').length === 1) {
        /* eslint-disable-next-line no-console */
        console.warn(chalk.yellow(`The base translation file for ${language} is missing at ${translationFile}.\n`));
      }
    }
  }));

  return translations;
};

module.exports = aggregateTranslationMessages;
