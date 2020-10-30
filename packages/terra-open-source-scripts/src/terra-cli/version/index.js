const versionMonoRepoHandler = require('./versionMonoRepoHandler');
const versionRepoHandler = require('./versionRepoHandler');
const isMonoRepo = require('../../utils/isMonoRepo');

const version = {
  command: 'version',
  describe: 'Update the version and changelog of the project(s)',
  handler: async () => (await isMonoRepo() ? versionMonoRepoHandler() : versionRepoHandler()),
};

module.exports = version;
