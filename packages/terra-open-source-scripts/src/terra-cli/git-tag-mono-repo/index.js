const gitTagMonoRepoHandler = require('./gitTagMonoRepoHandler');

const gitTagMonoRepo = {
  command: 'git-tag-mono-repo',
  describe: 'Tag the mono repo for release',
  handler: gitTagMonoRepoHandler,
};

module.exports = gitTagMonoRepo;
