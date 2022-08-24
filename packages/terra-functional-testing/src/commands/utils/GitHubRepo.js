/**
 * This module provides a simplified interface to github repos.
 *
 * It's basically a wrapper around octokit. The purpose here is to avoid people
 * re-implememnting octokit w/ auth and error handling in many places.
 *
 * The JSON datatypes are filtered versions of the JSON representations you
 * can read about at https://docs.github.com/en/rest.
 */

const { Octokit } = require('octokit');

/**
 * Information about a PR.
 * @typedef {Object} PullRequest
 * @property {number} number
 * @property {Object} head - The head branch
 * @property {string} head.ref
 * @property {Object} base - The base branch
 * @property {string} base.ref
 *
 * @see {@link https://git-scm.com/book/en/v2/Git-Internals-Git-References|Git References} to learn about refs.
 */

/**
 * Create a simplified view of a PR.
 *
 * @param {object} json A PR from the ReST API.
 * @returns {PullRequest}
 */
function filterPullRequest(json) {
  // If you change this, please update the PullRequest typedef as well.
  return {
    number: json.number,
    head: {
      ref: json.head.ref,
    },
    base: {
      ref: json.base.ref,
    },
  };
}

/**
 * Information about an issue's comments.
 * @typedef {Array} IssueComments
 * @property {string} body The comment message.
 * @property {string} issueUrl
 */

/**
 * Create a simplified view of issue comments.
 *
 * @param {Array} json Comments from the ReST API.
 * @returns {IssueComments} Some information about the comments.
 */
function filterIssueComments(json) {
  // If you change this, please update the IssueComments typedef as well.
  return json.map((comm) => ({
    body: comm.body,
    issueUrl: comm.issueUrl,
  }));
}

/**
 * Can be used to get and post a few things to a GitHub repo. Saves you from
 * having to figure out auth and error handling each time.
 *
 * It supports both github.com and enterprise github hosts if they have ReST
 * API v3 and https.
 */
class GitHubRepo {
  /**
   * Create a Repo to perform further actions on it.
   * @param {string} path The URL path to the repo, like /xenoworf/my-project.
   * @param {object} [options]
   * @param {string} [options.baseUrl=https://api.github.com] The API base URL of your GitHub.
   * @param {string} [options.personalAccessToken] Will be used to authenticate GitHub API requests.
   */
  constructor(path, options) {
    [, this.owner, this.repo] = path.split('/');
    this.octokitOptions = {};
    if (options && options.baseUrl) {
      this.octokitOptions.baseUrl = options.baseUrl;
    }
    if (options && options.personalAccessToken) {
      this.octokitOptions.auth = options.personalAccessToken;
    }
    this.octokit = new Octokit(this.octokitOptions);
  }

  /**
   * This method is to make sure people see useful errors, rather than merely 'Not Found', for example.
   *
   * If you need to debug further, inspect err.request and err.reply as needed.
   * @param {string} msg A summary of what happened.
   * @param {Error} err The original object.
   */
  static errorHandler(msg, err) {
    throw new Error(`${msg}. Recieved status ${err.response.status} for ${err.request.method} ${err.request.url}`);
  }

  /**
   * Get information about a PR.
   *
   * @param {(number|string)} num The PR's number.
   * @returns {PullRequest}
   * @throws Will throw an error if the API call doesn't return status 200 OK.
   */
  async getPullRequest(num) {
    const result = await this.octokit.request('GET /repos/{owner}/{repo}/pulls/{num}', {
      owner: this.owner,
      repo: this.repo,
      num,
    }).catch(err => GitHubRepo.errorHandler('Failed to get pull request', err));
    return filterPullRequest(result.data);
  }

  /**
   * Get information about an issue's comments.
   * @param {(number|string)} num The issue's number.
   * @returns {IssueComments[]}
   * @throws Will throw an error if the API call doesn't return status 200 OK.
   */
  async getIssueComments(num) {
    const result = await this.octokit.request('GET /repos/{owner}/{repo}/issues/{num}', {
      owner: this.owner,
      repo: this.repo,
      num,
    }).catch(err => GitHubRepo.errorHandler('Failed to get issue comments', err));
    return filterIssueComments(result.data);
  }

  /**
   * Add a new comment to an issue.
   * @param {(number|string)} num The issue's number.
   * @param {string} body Your comment message, e.g. "Hello, there.".
   * @throws Will throw an error if the API call doesn't return 201 Created.
   */
  async postIssueComment(num, body) {
    await this.octokit.request('POST /repos/{owner}/{repo}/issues/{num}/comments', {
      owner: this.owner,
      repo: this.repo,
      num,
      body,
    }).catch(err => GitHubRepo.errorHandler('Failed to post issue comment', err));
  }
}

module.exports = GitHubRepo;
