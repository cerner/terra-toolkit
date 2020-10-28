const updateChangelogHandler = require('./updateChangelogHandler');

const updateChangelog = {
  command: 'update-changelog',
  describe: 'Add command(s) to the list that the terra command is aware of',
  handler: updateChangelogHandler,
};

module.exports = updateChangelog;
