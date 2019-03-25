const commander = require('commander');
const i18nPackageJson = require('../../package.json');
const supportedLocales = require('./i18nSupportedLocales');
const parseCLIList = require('../utils/parse-cli-list');

const aggregateTranslations = require('./aggregate-translations');

// Adds custom search directory paths
const customSearchDirectories = [];
const addCustomDirectory = (searchPattern) => {
  customSearchDirectories.push(searchPattern);
};

const customExcludeDirectories = [];
const addCustomExclude = (searchPattern) => {
  customExcludeDirectories.push(searchPattern);
};

// Parse process arguments
commander
  .version(i18nPackageJson.version)
  .option('-b, --baseDir [baseDir]', `The directory to start searching from and to prepend to the output directory. Default: ${process.cwd()}`)
  .option('-d, --directories [directories]', 'Regex pattern to glob search for translations. Default: []', addCustomDirectory)
  .option('-l, --locales [locales]', `The list of locale codes aggregate on and combine into a single, respective translation file. Default: ${supportedLocales}`, parseCLIList)
  .option('-o, --outputDir [outputDir]', 'The output location of the generated configuration file. Default: ./aggregated-translations')
  .option('-c, --config [configPath]', 'The path to the terra i18n configuration file.')
  .option('-e, --exclude [exclude]', 'Regex pattern to glob filter out directories. Default: []', addCustomExclude)
  .option('-f, --format [format]', 'Format to output the aggregated translations to. Options are [es5, es6]. Default: es5')
  .parse(process.argv);

const aggregationOption = {
  baseDirectory: commander.baseDir,
  directories: customSearchDirectories,
  exclude: customExcludeDirectories,
  locales: commander.locales,
  outputDir: commander.outputDir,
  configPath: commander.config,
  format: commander.format,
};

aggregateTranslations(aggregationOption);
