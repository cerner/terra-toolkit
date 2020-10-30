const releaseMonoRepoHandler = require('./releaseMonoRepoHandler');
const releaseRepoHandler = require('./releaseRepoHandler');
const isMonoRepo = require('../../utils/isMonoRepo');

const release = {
  command: 'release',
  describe: 'Tag the repo and release',
  handler: async () => (await isMonoRepo() ? releaseMonoRepoHandler() : releaseRepoHandler()),
};

module.exports = release;
