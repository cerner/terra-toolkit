jest.mock('fs-extra');
jest.mock('child_process');
jest.mock('util');
jest.mock('@cerner/terra-cli/lib/utils/Logger');
jest.mock('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');

const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');

const mockExec = jest.fn();
promisify.mockImplementation(() => mockExec);

const updateChangelogForPackage = require('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');
const prepareForReleaseMonoRepoHandler = require('../../../../src/terra-cli/prepare-for-release/prepareForReleaseMonoRepoHandler');

const VERSION_OUTPUT_PATH = path.join(process.cwd(), 'tmp', 'version-output.txt');

describe('prepareForReleaseMonoRepoHandler', () => {
  it('prompts for versions, updates the versions, and updates the change log of all the repos in the monorepo', async () => {
    fs.readFile.mockResolvedValueOnce('[0m[37;40mlerna[0m [0m[32;1msuccess[0m [0m[35mversion[0m finished');
    mockExec.mockResolvedValueOnce({
      stdout: `lerna notice cli v3.22.1
lerna info versioning independent
lerna info Looking for changed packages since @cerner/terra-toolkit-docs@1.1.0
lerna info ignoring diff in paths matching [ 'packages/terra-functional-testing/**',
lerna info ignoring diff in paths matching   'packages/terra-cli/**' ]
@cerner/terra-toolkit-docs
@cerner/terra-cli
lerna success found 1 package ready to publish`,
    });

    await prepareForReleaseMonoRepoHandler();

    expect(fs.ensureFile).toHaveBeenCalledWith(VERSION_OUTPUT_PATH);
    expect(childProcess.execSync).toHaveBeenCalledWith(`script -q ${VERSION_OUTPUT_PATH} lerna version --no-git-tag-version`, { stdio: 'inherit' });
    expect(updateChangelogForPackage).toHaveBeenCalledWith('packages/terra-toolkit-docs');
    expect(updateChangelogForPackage).toHaveBeenCalledWith('packages/terra-cli');
    expect(fs.remove).toHaveBeenCalledWith(VERSION_OUTPUT_PATH);
  });

  it('does not update versions or change logs when lerna could not successfully version', async () => {
    fs.readFile.mockResolvedValueOnce('random text');

    await prepareForReleaseMonoRepoHandler();

    expect(fs.ensureFile).toHaveBeenCalledWith(VERSION_OUTPUT_PATH);
    expect(childProcess.execSync).toHaveBeenCalledWith(`script -q ${VERSION_OUTPUT_PATH} lerna version --no-git-tag-version`, { stdio: 'inherit' });
    expect(updateChangelogForPackage).not.toHaveBeenCalled();
    expect(fs.remove).toHaveBeenCalledWith(VERSION_OUTPUT_PATH);
  });
});
