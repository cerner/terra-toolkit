const yargs = require('yargs/yargs');
const path = require('path');
const fs = require('fs-extra');

const Logger = require('./lib/utils/Logger');

const DEPENDENCY_ALLOW_LIST = ['terra-functional-testing', 'terra-open-source-scripts'];

const setupCLI = () => {
  const cli = yargs();

  return cli.usage('Usage: $0 <command> [options]')
    .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
    .recommendCommands()
    .strict()
    .fail((msg, err) => {
      // certain yargs validations throw strings
      const actual = err || new Error(msg);

      // ValidationErrors are already logged, as are package errors
      if (actual.name !== 'ValidationError' && !actual.pkg) {
        // the recommendCommands() message is too terse
        if (/Did you mean/.test(actual.message)) {
          // eslint-disable-next-line no-console
          console.error(`Unknown command "${cli.parsed.argv._[0]}"`);
        }

        // eslint-disable-next-line no-console
        console.error(actual.message);
      }

      // exit non-zero so the CLI can be usefully chained
      cli.exit(actual.code > 0 ? actual.code : 1, actual);
    })
    .alias('h', 'help')
    .alias('v', 'version')
    .wrap(cli.terminalWidth());
};

const subDirectoriesOfDirectory = async (directoryPath) => {
  const currentDirectoryEnries = await fs.readdir(directoryPath, { withFileTypes: true });
  return currentDirectoryEnries.filter(directoryEntry => directoryEntry.isDirectory())
    .map(directoryEntry => path.join(directoryPath, directoryEntry.name));
};

const terraClIDirectoriesFromPaths = async (paths, preferSrc) => {
  const cliDirectories = paths.map(dependencyPath => path.join(dependencyPath, preferSrc ? 'src' : 'lib', 'terra-cli'));
  const pathExistsForDirectories = await Promise.all(cliDirectories.map((directory) => fs.pathExists(directory)));
  return cliDirectories.filter((_, index) => pathExistsForDirectories[index]);
};

const loadTerraCommandPaths = async () => {
  const { name } = fs.readJSONSync(path.join(process.cwd(), 'package.json'));
  const firstLevelDependencyPaths = DEPENDENCY_ALLOW_LIST.map(dependency => path.join(process.cwd(), 'node_modules', dependency));
  const toolkitPackagePaths = (name === 'terra-toolkit' ? DEPENDENCY_ALLOW_LIST.map(dependency => path.join(process.cwd(), 'packages', dependency)) : []);
  const currentProjectPaths = (DEPENDENCY_ALLOW_LIST.includes(name) ? [process.cwd()] : []);
  const terraCLIDirectories = [
    // Prefer lib from installed dependencies
    ...(await terraClIDirectoriesFromPaths(firstLevelDependencyPaths, false)),
    // Prefer src from local mono repo packages and the current project
    ...(await terraClIDirectoriesFromPaths([...toolkitPackagePaths, ...currentProjectPaths], true)),
  ];
  return (await Promise.all(terraCLIDirectories.map((directory) => subDirectoriesOfDirectory(directory)))).reduce((previousOutput, value) => previousOutput.concat(value), []);
};

const terraCLI = async (argv) => {
  let cli = setupCLI();
  const commandPaths = await loadTerraCommandPaths();

  commandPaths.forEach((commandPath) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const commandConfig = require(commandPath);
    if (commandConfig) {
      cli = cli.command(commandConfig);
    }
  });

  return cli.parse(argv);
};

module.exports = terraCLI;
module.exports.Logger = Logger;
