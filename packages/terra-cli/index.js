const yargs = require('yargs/yargs');
const path = require('path');

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

const requireWithNoError = (id) => {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(id);
  } catch {
    // Do nothing on failure
  }
  return undefined;
};

const terraCLI = (argv) => {
  let cli = setupCLI();
  const commands = [path.join(__dirname, './scripts/add-terra-commands'), ...(requireWithNoError('./configuration.json') || [])];

  commands.forEach((command) => {
    const commandConfig = requireWithNoError(command);
    if (commandConfig) {
      cli = cli.command(commandConfig);
    }
  });

  return cli.parse(argv);
};

module.exports = terraCLI;
