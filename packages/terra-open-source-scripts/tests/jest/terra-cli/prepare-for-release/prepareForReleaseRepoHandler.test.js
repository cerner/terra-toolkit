jest.mock('prompts');
jest.mock('npmlog');
jest.mock('util');
jest.mock('@npmcli/promise-spawn');
jest.mock('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');
jest.mock('../../../../src/terra-cli/prepare-for-release/logReleasingPackages');

const prompts = require('prompts');
const path = require('path');
const log = require('npmlog');
const spawn = require('@npmcli/promise-spawn');
const updateChangelogForPackage = require('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');
const logReleasingPackages = require('../../../../src/terra-cli/prepare-for-release/logReleasingPackages');

const prepareForReleaseRepoHandler = require('../../../../src/terra-cli/prepare-for-release/prepareForReleaseRepoHandler');

describe('prepareForReleaseRepoHandler', () => {
  it('prompts for a version, updates the version, and updates the change log of the current repo for a patch version', async () => {
    prompts.mockResolvedValueOnce({ versionType: 'patch' });
    spawn.mockResolvedValueOnce({ stdout: 'v1.0.1' });

    await prepareForReleaseRepoHandler();

    expect(log.pause).toHaveBeenCalled();
    expect(prompts).toHaveBeenCalledWith([
      {
        type: 'select',
        name: 'versionType',
        message: 'What type of release do you want to version for?',
        choices: [{ title: 'major', value: 'major' }, { title: 'minor', value: 'minor' }, { title: 'patch', value: 'patch' }],
        pageSize: 3,
      },
    ]);
    expect(log.resume).toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledWith('npm', ['--no-git-tag-version', 'version', 'patch'], { stdioString: true });
    expect(updateChangelogForPackage).toHaveBeenCalledWith(process.cwd());
    expect(logReleasingPackages).toHaveBeenCalledWith([`${path.basename(process.cwd())}@1.0.1`]);
  });

  it('prompts for a version, updates the version, and updates the change log of the current repo for a minor version', async () => {
    prompts.mockResolvedValueOnce({ versionType: 'minor' });
    spawn.mockResolvedValueOnce({ stdout: 'v1.1.0' });

    await prepareForReleaseRepoHandler();

    expect(log.pause).toHaveBeenCalled();
    expect(prompts).toHaveBeenCalledWith([
      {
        type: 'select',
        name: 'versionType',
        message: 'What type of release do you want to version for?',
        choices: [{ title: 'major', value: 'major' }, { title: 'minor', value: 'minor' }, { title: 'patch', value: 'patch' }],
        pageSize: 3,
      },
    ]);
    expect(log.resume).toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledWith('npm', ['--no-git-tag-version', 'version', 'minor'], { stdioString: true });
    expect(updateChangelogForPackage).toHaveBeenCalledWith(process.cwd());
    expect(logReleasingPackages).toHaveBeenCalledWith([`${path.basename(process.cwd())}@1.1.0`]);
  });

  it('prompts for a version, updates the version, and updates the change log of the current repo for a major version', async () => {
    prompts.mockResolvedValueOnce({ versionType: 'major' });
    spawn.mockResolvedValueOnce({ stdout: 'v2.0.0' });

    await prepareForReleaseRepoHandler();

    expect(log.pause).toHaveBeenCalled();
    expect(prompts).toHaveBeenCalledWith([
      {
        type: 'select',
        name: 'versionType',
        message: 'What type of release do you want to version for?',
        choices: [{ title: 'major', value: 'major' }, { title: 'minor', value: 'minor' }, { title: 'patch', value: 'patch' }],
        pageSize: 3,
      },
    ]);
    expect(log.resume).toHaveBeenCalled();
    expect(spawn).toHaveBeenCalledWith('npm', ['--no-git-tag-version', 'version', 'major'], { stdioString: true });
    expect(updateChangelogForPackage).toHaveBeenCalledWith(process.cwd());
    expect(logReleasingPackages).toHaveBeenCalledWith([`${path.basename(process.cwd())}@2.0.0`]);
  });
});
