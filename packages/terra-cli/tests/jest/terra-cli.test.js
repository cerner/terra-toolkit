const childProcess = require('child_process');
const path = require('path');
const { promisify } = require('util');

const exec = promisify(childProcess.exec);

describe('terra-cli', () => {
  it('returns the available commands for a non terra-toolkit project', async () => {
    const actualOutput = (await exec('../../../../bin/terra --help', { cwd: path.join(__dirname, 'fixtures', 'normal-project') })).stdout;
    expect(actualOutput).toMatchSnapshot();
  });

  it('returns the available commands for terra-toolkit by looking in the packages directory', async () => {
    const actualOutput = (await exec('../../../../bin/terra --help', { cwd: path.join(__dirname, 'fixtures', 'terra-toolkit') })).stdout;
    expect(actualOutput).toMatchSnapshot();
  });
});
