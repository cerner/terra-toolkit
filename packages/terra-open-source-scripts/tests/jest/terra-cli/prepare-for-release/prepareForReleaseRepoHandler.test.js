jest.mock('inquirer');
jest.mock('npmlog');
jest.mock('util');
jest.mock('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');

const inquirer = require('inquirer');
const log = require('npmlog');
const { promisify } = require('util');
const updateChangelogForPackage = require('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');

const mockExec = jest.fn();
promisify.mockImplementation(() => mockExec);

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
    expect(mockExec).toHaveBeenCalledWith('npm --no-git-tag-version version patch');
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
    expect(mockExec).toHaveBeenCalledWith('npm --no-git-tag-version version minor');
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
    expect(mockExec).toHaveBeenCalledWith('npm --no-git-tag-version version major');
    expect(updateChangelogForPackage).toHaveBeenCalledWith(process.cwd());
  });
});
