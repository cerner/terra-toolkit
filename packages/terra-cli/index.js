const yargs = require('yargs/yargs');
const path = require('path');
const fs = require('fs-extra');

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

const subDirectoriesOfDirectory = (directoryPath) => (
  fs.readdirSync(directoryPath, { withFileTypes: true })
    .filter(directoryEntry => directoryEntry.isDirectory())
    .map(directoryEntry => path.join(directoryPath, directoryEntry.name))
);

const loadTerraCommands = () => {
  const { dependencies = [], devDependencies = [], name } = fs.readJSONSync(path.join(process.cwd(), 'package.json'));
  const firstLevelDependencies = [...Object.keys(dependencies), ...Object.keys(devDependencies)];
  const firstLevelDependencyPaths = firstLevelDependencies.map(directory => path.join(process.cwd(), 'node_modules', directory));
  const additionalDependencyPaths = (name === 'terra-toolkit' ? subDirectoriesOfDirectory(path.join(process.cwd(), 'packages')) : []);
  const terraCLIDirectories = [...firstLevelDependencyPaths, ...additionalDependencyPaths, process.cwd()].map(dependencyPath => path.join(dependencyPath, 'lib', 'terra-cli')).filter(directory => fs.pathExistsSync(directory));
  return terraCLIDirectories.map((directory) => subDirectoriesOfDirectory(directory)).reduce((previousOutput, value) => previousOutput.concat(value), []);
};

const terraCLI = (argv) => {
  let cli = setupCLI();
  const commands = loadTerraCommands();

  commands.forEach((command) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const commandConfig = require(command);
    if (commandConfig) {
      cli = cli.command(commandConfig);
    }
  });

  return cli.parse(argv);
};

module.exports = terraCLI;
