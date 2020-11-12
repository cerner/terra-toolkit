const childProcess = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const { promisify } = require('util');
const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const setupGit = require('./setupGit');

const logger = new Logger({ prefix: '[terra-open-source-scripts:release]' });
const exec = promisify(childProcess.exec);

// Manipulate lerna publish output to find what packages were released and need to be tagged.
const getTags = (output) => {
  const successString = 'Successfully published:\n';
  const lastIndexOf = output.lastIndexOf(successString);
  // If we didn't find the success string, we have no tags
  if (lastIndexOf < 0) {
    return null;
  }
  const substring = output.substring(lastIndexOf + successString.length);
  const withoutDashes = substring.replace(/ - /g, '').trim();
  return withoutDashes.split('\n');
};

module.exports = async () => {
  // Writes the npm token used to publish to the npm registry. Requires the NPM_TOKEN to be set
  await fs.writeFile(path.join(process.env.HOME, '.npmrc'), `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`, 'utf-8');

  // Capture the stdout from the publish command so that we can parse it for the appropriate tags
  const { stdout } = await exec('npx lerna publish from-package --yes');
  logger.info(stdout);

  // Retrieve the tags that were published
  const tags = getTags(stdout);
  if (tags) {
    // Setup git
    await setupGit();
    logger.info('tags', JSON.stringify(tags, null, 2));

    // Tag based on what was published and push those tags to origin
    await Promise.all(tags.map(tag => exec(`git tag -a ${tag} -m "${tag}"`)));
    await exec('git push origin --tags');
  } else {
    logger.info('Nothing to tag');
  }
};
