const commander = require('commander');
const supportedLocales = require('./i18nSupportedLocales');

const aggregateTranslations = require('./aggregate-translations');

const parseCLIList = list => list.replace(/[\[\'\'\]\s]/g, '').split(',').map(String);

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
  .version(process.env.npm_package_version)
  .option('-b, --baseDir [baseDir]', 'The directory to start searching from and to prepend to the output directory', process.cwd())
  .option('-d, --directories [directories]', 'Regex pattern to glob search for translations', addCustomDirectory)
  .option('-l, --locales [locales]', 'The list of locale codes aggregate on and combine into a single, respective translation file ', parseCLIList, supportedLocales)
  .option('-o, --outputDir [outputDir]', 'The output location of the generated configuration file', './aggregated-translations')
  .option('-c, --config [configPath]', 'The path to the terra i18n configuration file', undefined)
  .option('-e, --exclude [exclude]', 'Regex pattern to glob filter out directories', addCustomExclude)
  .option('-f, --format [format]', 'Format to output the aggregated translations to. Options are [es5, es6]', 'es5')
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
