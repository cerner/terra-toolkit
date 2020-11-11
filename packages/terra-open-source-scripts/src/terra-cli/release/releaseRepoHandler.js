const pacote = require('pacote');
const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');
const { promisify } = require('util');
const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const setupGit = require('./setupGit');

const logger = new Logger({ prefix: '[terra-open-source-scripts:release]' });

const exec = promisify(childProcess.exec);

const isPublished = async (name, version) => {
  const pkgJson = await pacote.packument(name, {
    registry: 'https://registry.npmjs.org/',
  });
  const publishedVersions = Object.keys(pkgJson.versions);
  return publishedVersions.includes(version);
};

module.exports = async () => {
  if (await isPublished()) {
    logger.info('Nothing to publish');
    return;
  }
  await fs.writeFile(path.join(process.env.HOME, '.npmrc'), `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`, 'utf-8');

  const packageFile = path.resolve(process.cwd(), 'package.json');

  // Read package.json and pull out version
  const { name, version } = await fs.readJSON(packageFile);

  await setupGit(name, version);

  const tag = `v${version}`;

  await exec('npm publish');
  await exec(`git tag -a ${tag} -m "${tag}"`);
  await exec('git push origin --tags');
};
