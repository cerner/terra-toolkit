const commander = require('commander');
const i18nPackageJson = require('../../package.json');
const parseCLIList = require('../utils/parse-cli-list');

const aggregateTranslations = require('./aggregate-translations');

// Parse process arguments
commander
  .version(i18nPackageJson.version)
  .option('-b, --baseDir [baseDir]', 'The directory to start searching from and to prepend to the output directory')
  .option('-d, --directories [directories]', 'Regex pattern to glob search for translations', parseCLIList)
  .option('-l, --locales [locales]', 'The list of locale codes aggregate on and combine into a single, respective translation file ', parseCLIList)
  .option('-o, --outputDir [outputDir]', 'The output location of the generated configuration file')
  .option('-c, --config [configPath]', 'The path to the terra i18n configuration file')
  .option('-e, --exclude [exclude]', 'Regex pattern to glob filter out directories', parseCLIList)
  .option('-f, --format [format]', 'Format to output the aggregated translations to. Options are [es5, es6]', 'es5')
  .parse(process.argv);

const aggregationOption = {
  baseDirectory: commander.baseDir,
  directories: commander.directories,
  exclude: commander.exclude,
  locales: commander.locales,
  outputDir: commander.outputDir,
  configPath: commander.config,
  format: commander.format,
};

aggregateTranslations(aggregationOption);
