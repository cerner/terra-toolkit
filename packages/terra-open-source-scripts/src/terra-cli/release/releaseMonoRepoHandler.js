const childProcess = require('child_process');
const { promisify } = require('util');
const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const setupGit = require('./setupGit');

const logger = new Logger({ prefix: '[terra-open-source-scripts:release]' });
const exec = promisify(childProcess.exec);

const filePath = './publish-output.txt';

// Manipulate lerna publish output to find what packages were released and need to be tagged.
const getTags = (output) => {
  const successString = 'Successfully published:\n';
  const lastIndexOf = output.lastIndexOf(successString);
  if (lastIndexOf < 0) {
    return null;
  }
  const substring = output.substring(lastIndexOf + successString.length);
  const withoutDashes = substring.replace(/ - /g, '').trim();
  return withoutDashes.split('\n');
};

module.exports = async () => {
  const output = await exec(`npx lerna publish from-package --yes > ${filePath}`);
  logger.info(output);
  const tags = getTags(output);
  if (tags) {
    setupGit();
    logger.info('tags', JSON.stringify(tags, null, 2));
    await Promise.all(tags.map(tag => exec(`git tag -a ${tag} -m "${tag}"`)));
    await exec('git push origin --tags');
  } else {
    logger.info('Nothing to tag');
  }
};
