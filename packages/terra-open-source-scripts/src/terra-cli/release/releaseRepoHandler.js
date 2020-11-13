const pacote = require('pacote');
const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');
const { promisify } = require('util');
const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const setupGit = require('./setupGit');
const setupNPM = require('./setupNPM');

const logger = new Logger({ prefix: '[terra-open-source-scripts:release]' });

const exec = promisify(childProcess.exec);

/**
 * Determines whether the name and version of a given package is already published
 * @param {string} name - the name of the package to check
 * @param {string} version - the version of the package to check
 * @returns {boolean} whether or not the package is already published
 */
const isAlreadyPublished = async (name, version) => {
  // Retrieve metadata about the given package
  const pkgJson = await pacote.packument(name, {
    registry: 'https://registry.npmjs.org/',
  });

  // Determine if a version is in the list of metadata
  const publishedVersions = Object.keys(pkgJson.versions);
  return publishedVersions.includes(version);
};

module.exports = async () => {
  const packageFile = path.resolve(process.cwd(), 'package.json');

  // Read package.json and pull out version
  const { name, version } = await fs.readJSON(packageFile);

  if (await isAlreadyPublished(name, version)) {
    logger.info('Nothing to publish');
    return;
  }

  // Setup NPM for the publishing process
  await setupNPM();

  // Actually publish the package to npm
  await exec('npm publish');

  // Setup git
  await setupGit(name, version);

  // Tag based on what was published and push those tags to origin
  const tag = `v${version}`;
  await exec(`git tag -a ${tag} -m "${tag}"`);
  await exec('git push origin --tags');
};
