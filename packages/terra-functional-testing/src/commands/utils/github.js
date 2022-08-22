/**
 * This module encapsulates the full-power octokit library inside a simple interface.
 * https://github.com/octokit/octokit.js
 *
 * It supports both github.com and enterprise github hosts.
 * Requires your github host to have API v3 and https.
 */
const { Octokit } = require('octokit');

/**
 * The info needed to look up a PR.
 * @typedef PrLookupInfo
 * @type {object}
 * @property {string} githubHostname
 * @property {string} repoOwner
 * @property {string} repoName
 * @property {string} prNumber
 */

/**  Info about a PR, fetched from a github instance. */
class PrInfo {
  /**
   * @param {string} ghId Github's internal identifier for the PR.
   * @param {string} prNumber
   * @param {string} headRef The ref of the PR's head branch.
   * @param {string} baseRef The ref ot the PR's base branch.
   */
  constructor(ghId, prNumber, headRef, baseRef) {
    this.githubId = String(ghId);
    this.prNumber = String(prNumber);
    this.head = {
      ref: headRef,
    };
    this.base = {
      ref: baseRef,
    };
  }
}

/**
 * Look up information about a PR from github or an enterprise github.
 *
 * If anything goes wrong looking up the PR, an exception will be thrown.
 * @param {PrLookupInfo}
 * @returns {PrInfo}
 */
async function lookupPR(config) {
  const {
    githubHostname, owner, repo, prNumber,
  } = config;

  const octokit = new Octokit({
    baseURL: `https://${githubHostname}/api/v3`,
  });

  const result = await octokit.request('GET /repos/{owner}/{repo}/pulls/{prNumber}', {
    owner,
    repo,
    prNumber,
  });
  if (result.status !== 200) {
    throw new Error(`${octokit.baseURL} GET /repos/${owner}/${repo}/pulls/${prNumber} returned status ${result.status}`);
  }

  return new PrInfo(result.data.id, result.data.number, result.data.head.ref, result.data.base.ref);
}

module.exports = {
  PrInfo,
  lookupPR,
};
