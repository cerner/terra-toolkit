const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { Logger } = require('@cerner/terra-cli');
const { URL } = require('url');

const logger = new Logger({ prefix: '[terra-functional-testing:getRemoteScreenshotConfiguration]' });

/**
 * Retrieves the authorization header from the .roll_out.yml file given the repository id in the publish site config
 * @param {string} repositoryId - the id for the publish repository that matches up with the .roll_out.yml file
 * @return {string} - returns the authentication string or undefined if no credentials provided.
 */
const getAuthHeader = (repositoryId) => {
  try {
    const authConfig = yaml.safeLoad(fs.readFileSync(path.join(process.env.HOME, '.roll_out.yml')));
    const auth = authConfig[repositoryId];

    return `Basic ${Buffer.from((`${auth.username}:${auth.password}`)).toString('base64')}`;
  } catch (e) {
    logger.warn(`No credentials provided for ${repositoryId}`);
    // Ultimately, be optimistic here that whatever set up a consumer has doesn't need credentials.  If not, we'll fail later.
    return undefined;
  }
};

/**
 * Creates the authentication header and url configurations needed to access the remote site where screenshots are located.
 * @param {Object} screenshotsSites - The url of the site where screenshots are located.
 * @param {string} buildBranch - The branch being built.
 * @return {Object} - returns object containing the required authentication and configurations.
 */
const getRemoteScreenshotConfiguration = (screenshotsSites, buildBranch) => {
  const branchName = buildBranch || 'master';
  const packageJson = fs.readJsonSync(path.join(process.cwd(), 'package.json'));
  const packageRepoUrl = new URL(packageJson.repository.url);
  const { repositoryId, repositoryUrl } = screenshotsSites || {};
  const config = {
    artifactId: packageJson.name,
    buildBranch: branchName,
    groupId: `com.cerner.${packageRepoUrl.pathname.match(/[^/]+/g)[0]}`,
    repositoryId,
    repositoryUrl,
  };

  // Get the Nexus site. For example, if repositoryUrl is http://repo.release.cerner.corp/nexus/service/local/repositories/internal-site/
  // get "internal-site" and account for the last "/" if one exists.
  const url = new URL(config.repositoryUrl);
  const sitePaths = url.pathname.match(/[^/]+/g);

  if (!sitePaths) {
    throw new Error(`The repository url is malformed: ${config.repositoryUrl}`);
  }

  const latestScreenshotsPath = path.join(process.cwd(), 'tests', 'wdio', '__snapshots__', 'latest');
  const referenceScreenshotsPath = path.join(process.cwd(), 'tests', 'wdio', '__snapshots__', 'reference');
  const zipFilePath = path.join(process.cwd(), 'tests', 'wdio');
  const nexusSite = sitePaths[sitePaths.length - 1];
  const outputPublicPath = `/nexus/content/sites/${nexusSite}/${config.groupId}/${config.artifactId}/build-screenshots/${config.buildBranch}`;

  return {
    publishScreenshotConfiguration: {
      latestScreenshotsPath,
      referenceScreenshotsPath,
      serviceAuthHeader: getAuthHeader(config.repositoryId),
      serviceUrl: `${config.repositoryUrl}/content-compressed/${config.groupId}/${config.artifactId}/build-screenshots/${config.buildBranch}/`.replace(/([^:]\/)\/+/g, '$1'),
      url: `${url.origin}/${outputPublicPath}/`.replace(/([^:]\/)\/+/g, '$1'),
      zipFilePath,
    },
  };
};

module.exports = getRemoteScreenshotConfiguration;
