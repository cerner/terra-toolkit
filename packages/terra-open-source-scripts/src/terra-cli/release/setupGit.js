const childProcess = require('child_process');
const { promisify } = require('util');

const exec = promisify(childProcess.exec);

/**
 * Sets up git for travis CI using the GITHUB_TOKEN environment variable
 */
module.exports = async () => {
  const travis = process.env.TRAVIS;

  if (travis) {
    await exec('git config --global user.email "travis@travis-ci.org"');
    await exec('git config --global user.name "Travis CI"');
    const remoteUrl = (await exec('git config --get remote.origin.url', { encoding: 'utf8' })).stdout.trim();
    const token = process.env.GITHUB_TOKEN;
    const newUrl = remoteUrl.replace('https://', `https://${token}@`);
    await exec(`git remote set-url origin "${newUrl}" > /dev/null 2>&1`);
  }
};
