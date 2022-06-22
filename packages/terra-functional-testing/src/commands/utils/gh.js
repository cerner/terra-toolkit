/**
 * This module encapsulates the full-power octokit library inside a simple interface.
 * https://github.com/octokit/octokit.js
 *
 * It supports both github.com and enterprise github hosts.
 * Requires your github host to have API v3 and https.
 */
const { Octokit } = require('octokit');

/**
 * Look up information about a github PR.
 *
 * @param {string} config.githubHostname The hostname of your github. Can be 'github.com' or your enterprise github (e.g. 'github.example.com').
 * @param {string} config.repoOwner Would be 'cerner' for https://github.com/cerner/terra-core/pulls/1.
 * @param {string} config.repoName Would be 'terra-core' for https://github.com/cerner/terra-core/pulls/1.
 * @param {string} config.prNumber Would be '1' for https://github.com/cerner/terra-core/pulls/1.
 * @returns An objection containing the PR's number, unique ID, head and base refs.
 *
 * If anything goes wrong looking up the PR, an exception will be thrown.
 */
async function getPR(config) {
  const {
    githubHostname, owner, repo, prNumber,
  } = config;

  const octokit = new Octokit({
    baseURL: `https://${githubHostname}/api/v3`,
  });
  let result;

  try {
    result = await octokit.request('GET /repos/{owner}/{repo}/pulls/{prNumber}', {
      owner,
      repo,
      prNumber,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Something went wrong trying to look up ${owner}/${repo} #${prNumber} from ${githubHostname}.`);
    throw e;
  }

  return {
    githubId: result.data.id,
    prNumber: result.data.number,
    head: {
      ref: result.data.head.ref,
    },
    base: {
      ref: result.data.base.ref,
    },
  };
}

async function test() {
  const config = {
    githubHostname: 'github.com',
    owner: 'cerner',
    repo: 'terra-core',
    prNumber: '1',
  };
  const pr = await getPR(config);
  console.log(pr);
}

module.exports = {
  test,
};
