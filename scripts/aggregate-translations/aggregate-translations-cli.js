const path = require('path');
const commander = require('commander');
const i18nPackageJson = require('../../package.json');
const supportedLocales = require('./i18nSupportedLocales');
const parseCLIList = require('../utils/parse-cli-list');

const aggregateTranslations = require('./aggregate-translations');

// Adds custom search directory paths
const customSearchDirectories = [];
const addCustomDirectory = (searchPattern) => {
  const customDir = searchPattern.split('/').join(path.sep);
  customSearchDirectories.push(customDir);
};

// Parse process arguments
commander
  .version(i18nPackageJson.version)
  .option('-b, --baseDir [baseDir]', 'The directory to start searching from and to prepend to the output directory', process.cwd())
  .option('-d, --directories [directories]', 'Regex pattern to glob search for translations', addCustomDirectory)
  .option('-l, --locales [locales]', 'The list of locale codes aggregate on and combine into a single, respective translation file ', parseCLIList, supportedLocales)
  .option('-o, --outputDir [outputDir]', 'The output location of the generated configuration file', './aggregated-translations')
  .option('-c, --config [configPath]', 'The path to the terra i18n configuration file', undefined)
  .parse(process.argv);

const aggregationOption = {
  baseDirectory: commander.baseDir,
  directories: customSearchDirectories,
  locales: commander.locales,
  outputDir: commander.outputDir,
  configPath: commander.config,
};

aggregateTranslations(aggregationOption);
