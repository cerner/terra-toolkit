jest.mock('inquirer');
jest.mock('npmlog');
jest.mock('util');
jest.mock('@npmcli/promise-spawn');
jest.mock('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');

const inquirer = require('inquirer');
const log = require('npmlog');
const spawn = require('@npmcli/promise-spawn');
const updateChangelogForPackage = require('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');

const prepareForReleaseRepoHandler = require('../../../../src/terra-cli/prepare-for-release/prepareForReleaseRepoHandler');

describe('prepareForReleaseRepoHandler', () => {
  it('prompts for a version, updates the version, and updates the change log of the current repo for a patch version', async () => {
    inquirer.prompt.mockResolvedValueOnce({ versionType: 'patch' });

    await prepareForReleaseRepoHandler();

    expect(log.pause).toHaveBeenCalled();
    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'list',
        name: 'versionType',
        message: 'What type of release do you want to version for?',
        choices: ['major', 'minor', 'patch'],
        pageSize: 3,
      },
    ]);
    expect(log.resume).toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledWith('npm', ['--no-git-tag-version', 'version', 'patch'], { stdioString: true });
    expect(updateChangelogForPackage).toHaveBeenCalledWith(process.cwd());
  });

  it('prompts for a version, updates the version, and updates the change log of the current repo for a minor version', async () => {
    inquirer.prompt.mockResolvedValueOnce({ versionType: 'minor' });

    await prepareForReleaseRepoHandler();

    expect(log.pause).toHaveBeenCalled();
    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'list',
        name: 'versionType',
        message: 'What type of release do you want to version for?',
        choices: ['major', 'minor', 'patch'],
        pageSize: 3,
      },
    ]);
    expect(log.resume).toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledWith('npm', ['--no-git-tag-version', 'version', 'minor'], { stdioString: true });
    expect(updateChangelogForPackage).toHaveBeenCalledWith(process.cwd());
  });

  it('prompts for a version, updates the version, and updates the change log of the current repo for a major version', async () => {
    inquirer.prompt.mockResolvedValueOnce({ versionType: 'major' });

    await prepareForReleaseRepoHandler();

    expect(log.pause).toHaveBeenCalled();
    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'list',
        name: 'versionType',
        message: 'What type of release do you want to version for?',
        choices: ['major', 'minor', 'patch'],
        pageSize: 3,
      },
    ]);
    expect(log.resume).toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledWith('npm', ['--no-git-tag-version', 'version', 'major'], { stdioString: true });
    expect(updateChangelogForPackage).toHaveBeenCalledWith(process.cwd());
  });
});
