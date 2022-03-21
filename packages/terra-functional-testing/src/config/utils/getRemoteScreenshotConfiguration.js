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
 * @param {Object} config.siteRepositoryId - the identifier of the repository where the screenshots are located.
 * @param {Object} config.siteRepositoryUrl - the URL of the repository where the screenshots are located.
 * @return {Object} - returns object containing the required authentication and configurations.
 */
const getRemoteScreenshotConfiguration = () => {
  const packageJson = fs.readJsonSync(path.join(process.cwd(), 'package.json'));
  const repositoryUrl = new URL(packageJson.repository.url);
  const defaultConfiguration = {
    artifactId: packageJson.name,
    groupId: `com.cerner.${repositoryUrl.pathname.match(/[^/]+/g)[0]}`,
    version: packageJson.version,
    site: {
      repositoryId: 'cerner-release-main-site',
      repositoryUrl: 'http://repo.release.cerner.corp/nexus/service/local/repositories/main-site',
    },
  };

  const actualConfiguration = { ...defaultConfiguration, ...packageJson.rollOut };

  // Get the Nexus site. For example, if repositoryUrl is http://repo.release.cerner.corp/nexus/service/local/repositories/internal-site/
  // get "internal-site" and account for the last "/" if one exists.
  const url = new URL(actualConfiguration.site.repositoryUrl);
  const sitePaths = url.pathname.match(/[^/]+/g);

  if (!sitePaths) {
    throw new Error(`The repository url is malformed: ${actualConfiguration.site.repositoryUrl}`);
  }

  const nexusSite = sitePaths[sitePaths.length - 1];
  const outputPublicPath = `/nexus/content/sites/${nexusSite}/${actualConfiguration.groupId}/${actualConfiguration.artifactId}/${actualConfiguration.version}`;

  return {
    publishScreenshotConfiguration: {
      url: `${url.origin}/${outputPublicPath}/`.replace(/([^:]\/)\/+/g, '$1'),
      serviceAuthHeader: getAuthHeader(actualConfiguration.site.repositoryId),
      serviceUrl: `${actualConfiguration.site.repositoryUrl}/content-compressed/${actualConfiguration.groupId}/${actualConfiguration.artifactId}/${actualConfiguration.version}/`.replace(/([^:]\/)\/+/g, '$1'),
    },
  };
};

module.exports = getRemoteScreenshotConfiguration;
