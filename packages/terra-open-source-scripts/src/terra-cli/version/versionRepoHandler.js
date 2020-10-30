const inquirer = require('inquirer');
const log = require('npmlog');
const childProcess = require('child_process');
const { promisify } = require('util');

const updateChangelogForPackage = require('./updateChangelogForPackage');

const exec = promisify(childProcess.exec);

const promptForVersionType = async () => {
  log.pause();

  const { versionType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'versionType',
      message: 'What type of release do you want to version for?',
      choices: ['major', 'minor', 'patch'],
      pageSize: 3,
    },
  ]);
  log.resume();
  return versionType;
};

module.exports = async () => {
  const versionType = await promptForVersionType();
  await exec(`npm --no-git-tag-version version ${versionType}`);
  await updateChangelogForPackage(process.cwd());
};
