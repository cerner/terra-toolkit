const addTerraCommandsHandler = require('./addTerraCommandsHandler');

const addTerraCommands = {
  command: 'add-terra-commands <commands..>',
  describe: 'Add command(s) to the list that the terra command is aware of',
  builder: (yargs) => (
    yargs.positional('commands', {
      commands: {
        type: 'string',
        describe: 'A list of paths to the commands that will be added to the list of terra commands.',
      },
    })
  ),
  handler: addTerraCommandsHandler,
};

module.exports = addTerraCommands;
