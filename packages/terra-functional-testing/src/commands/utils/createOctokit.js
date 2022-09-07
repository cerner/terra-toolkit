const { Octokit } = require('@octokit/core');

/** Creates an {@link https://github.com/octokit/core.js|Octokit core} instance from simplified options.
 * @param {string} [baseUrl] - An alternative github API base to https://github.com/api/v3
 * @param {string} [pat] - A {@link https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token|Personal Access Token} with which to authenticate your requests.
 * @returns a new Octokit instance.
 */
function createOctokit(baseUrl = null, token = null) {
  const options = {};
  if (token) {
    options.auth = token;
  }
  if (baseUrl) {
    options.baseUrl = baseUrl;
  }
  return new Octokit(options);
}

module.exports = createOctokit;
