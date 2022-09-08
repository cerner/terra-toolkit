/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
const expect = require('expect');
const fs = require('fs-extra');
const path = require('path');
const { URL } = require('url');
const { SevereServiceError } = require('webdriverio');
const { accessibility, element, screenshot } = require('../commands/validates');
const { toBeAccessible, toMatchReference } = require('../commands/expect');
const {
  createOctokit,
  describeTests,
  describeViewports,
  getViewports,
  hideInputCaret,
  ScreenshotRequestor,
  setApplicationLocale,
  setViewport,
} = require('../commands/utils');
const { BUILD_BRANCH, BUILD_TYPE } = require('../constants');

/**
 * WDIO's SevereServiceError's constructor only takes strings, but octokit's
 * rejected promises yield a rich error object. This class adapts the error
 * object to the SevereServiceError constructor's needs.
 */
class OctokitRequestFailureError extends SevereServiceError {
  constructor(error) {
    super(JSON.stringify(error, null, 4));
    this.name = 'OctokitRequestFailureError';
  }
}

class TerraService {
  /**
   * Service constructor.
   * @param {Object} _options - The options specific to this service.
   * @param {Object} _capabilities - The list of capabilities details.
   * @param {Object} config - The object containing the wdio configuration and options defined in the terra-cli test runner.
   */
  constructor(_options, _capabilities, config = {}) {
    const { serviceOptions, launcherOptions } = config;

    this.serviceOptions = {
      selector: '[data-terra-test-content] *:first-child',
      ...launcherOptions,
      ...serviceOptions,
    };

    const packageJson = fs.readJsonSync(path.join(process.cwd(), 'package.json'));
    const repoUrl = new URL(packageJson.repository.url);
    [this.repoName, this.repoOwner] = repoUrl.pathname.match(/[^/]+/g);
  }

  /**
   * Gets executed once before all workers get launched.
   * Downloads the reference screenshots from the remote repository if useRemoteReferenceScreenshots is true.
   * @param {Object} config wdio configuration object
   */
  async onPrepare(config) {
    if (!this.serviceOptions.useRemoteReferenceScreenshots) {
      return;
    }

    if (!config.getRemoteScreenshotConfiguration) {
      throw new SevereServiceError('config is missing getRemoteScreenshotConfiguration');
    }
    const prBaseBranch = await this.getPrBaseBranchRef();
    const screenshotConfig = config.getRemoteScreenshotConfiguration(config.screenshotsSites, prBaseBranch);
    const screenshotRequestor = new ScreenshotRequestor(screenshotConfig.publishScreenshotConfiguration);
    try {
      await screenshotRequestor.download();
    } catch (err) {
      throw new SevereServiceError(err);
    }
  }

  /**
   * Service hook executed prior to initializing the webdriver session.
   */
  beforeSession() {
    global.Terra = {};

    // Add the service options to the global.
    global.Terra.serviceOptions = this.serviceOptions;

    /**
     * This command must be defined in the beforeSession hook instead of together with the other Terra custom commands in the
     * before hook. The reason being WebdriverIO v6 now executes the describe block prior to running the before hook.
     * Therefore, this command needs to be defined before the test starts in the testing life cycle.
     *
     * Reference: https://github.com/webdriverio/webdriverio/issues/6119
     */
    global.Terra.describeTests = describeTests;
    global.Terra.describeViewports = describeViewports;
    global.Terra.viewports = getViewports;
  }

  /**
   * Service hook executed prior to test execution.
   * Initializes the Terra Service's custom commands.
   */
  before(capabilities) {
    // Set Jest's expect module as the global assertion framework.
    global.expect = expect;
    global.expect.extend({ toBeAccessible, toMatchReference });

    // Setup and expose global utility functions.
    global.Terra.setApplicationLocale = setApplicationLocale;
    global.Terra.hideInputCaret = hideInputCaret;

    // Setup and expose the validates utility functions.
    global.Terra.validates = { accessibility, element, screenshot };

    /**
     * Global axe override options.
     * Options modified here will be applied globally for all tests.
     */
    global.Terra.axe = {
      rules: {
        /**
         * This rule was introduced in axe-core v3.3 and causes failures in many Terra components.
         * The solution to address this failure vary by component. It is being disabled until a solution is identified in the future.
         *
         * Reference: https://github.com/cerner/terra-framework/issues/991
         */
        'scrollable-region-focusable': { enabled: false },
        /**
         * The lowlight theme adheres to a non-default color contrast ratio and fails the default ratio check.
         * The color-contrast ratio check is disabled for lowlight theme testing.
         */
        'color-contrast': { enabled: this.serviceOptions.theme !== 'clinical-lowlight-theme' },
      },
    };

    // IE driver takes longer to be ready for browser interactions.
    if (capabilities.browserName === 'internet explorer') {
      global.browser.$('body').waitForExist({
        timeout: global.browser.config.waitforTimeout,
        interval: 100,
      });
    }

    // Set the viewport size before the spec begins.
    setViewport(this.serviceOptions.formFactor || 'huge');
  }

  afterCommand(commandName, _args, _result, error) {
    if ((commandName === 'refresh' || commandName === 'url') && !error) {
      try {
        // This is only meant as a convenience so failure is not particularly concerning.
        global.Terra.hideInputCaret('body');

        if (global.browser.$('[data-terra-test-loading]').isExisting()) {
          global.browser.$('[data-terra-test-content]').waitForExist({
            timeout: global.browser.config.waitforTimeout + 2000,
            interval: 100,
          });
        }
      } catch (err) {
        // Intentionally blank. If this fails we don't want to warn because the user can't fix the issue.
      }
    }
  }

  /**
   * Create an octokit using the configured gitApiUrl and gitToken.
   * @returns {Object} an octokit instance.
   * @throws {SevereServiceError} if any required config is missing.
   */
  createOctokit() {
    if (!this.serviceOptions.gitToken) {
      throw new SevereServiceError('config.serviceOptions is missing gitToken');
    }
    if (!this.serviceOptions.gitApiUrl) {
      throw new SevereServiceError('config.serviceOptions is missing gitApiUrl');
    }
    return createOctokit(this.serviceOptions.gitApiUrl, this.serviceOptions.gitToken);
  }

  /**
   * Gets the base branch name (aka ref) of this pull(issue).
   * @returns {Promise} A promise of the base branch's ref string.
   * @throws {OctokitRequestFailureError} If the octokit request fails.
   */
  getPrBaseBranchRef() {
    return this.createOctokit()
      .request(`GET /repos/${this.repoName}/${this.repoOwner}/pulls/${this.serviceOptions.issueNumber}/`)
      .then(res => res.data.base.ref)
      .catch(err => { throw new OctokitRequestFailureError(err); });
  }

  /**
   * Get the comments of this issue.
   * @returns {Promise} A promise of the list of comment bodies of the issue.
   * @throws {OctokitRequestFailureError} If the octokit request fails.
   */
  getIssueComments() {
    return this.createOctokit()
      .request(`GET /repos/${this.repoName}/${this.repoOwner}/issues/${this.serviceOptions.issueNumber}/comments`)
      .then(res => res.data.map((comment) => comment.body))
      .catch(err => { throw new OctokitRequestFailureError(err); });
  }

  /**
   * Post a comment to this issue.
   * @param {string} comment The comment you want to post.
   * @returns {Promise} A promise of an octokit request result.
   * @throws {OctokitRequestFailureError} If the octokit request fails.
   */
  postIssueComment(comment) {
    return this.createOctokit()
      .request(`POST /repos/${this.repoName}/${this.repoOwner}/issues/${this.serviceOptions.issueNumber}/comments`, {
        body: comment,
      })
      .catch(err => { throw new OctokitRequestFailureError(err); });
  }

  /**
   * Gets executed once before all workers are shut down.
   * Uploads the reference screenshots to the remote repository if this build was triggered from a PR merge.
   * @param {Object} config wdio configuration object
   */
  async onComplete(_, config) {
    if (!this.serviceOptions.useRemoteReferenceScreenshots) {
      return;
    }
    if (!this.serviceOptions.buildBranch) {
      throw new SevereServiceError('config.serviceOptions is missing buildBranch');
    }

    if (process.env.SCREENSHOT_MISMATCH_CHECK && this.serviceOptions.buildBranch.match(BUILD_BRANCH.pullRequest)) {
      // When a PR is updated, we will one time post a warning mesage to the PR if the screenshots mismatch. This
      // gives the end-user the opportunity to fix the mismatch before the PR is merged. See the else block below
      // for what happens when the PR is merged.
      if (!this.serviceOptions.buildUrl) {
        throw new SevereServiceError('config.serviceOptions is missing buildUrl');
      }

      const message = [
        ':warning: :bangbang: **WDIO MISMATCH** \n\n',
        `Check that screenshot change is intended at: ${this.serviceOptions.buildUrl} \n\n`,
        'If screenshot change is intended, remote reference screenshots will be updated upon PR merge. \n',
        'If screenshot change is unintended, please fix screenshot issues before PR merge to prevent them from being uploaded. \n\n',
        'Note: This comment only appears the first time a screenshot mismatch is detected on a PR build, ',
        'future builds will need to be checked for unintended screenshot mismatchs.',
      ].join('');
      const comments = await this.getIssueComments();
      if (!comments.includes(message)) {
        await this.postIssueComment(message);
      }
    } else if (!this.serviceOptions.buildBranch.match(BUILD_BRANCH.pullRequest) && this.serviceOptions.buildType === BUILD_TYPE.branchEventCause) {
      // Branch event here means the PR has been merged. We will upload the screenshots to the base branch of the PR.
      // The PR's base branch is the merge target of the PR, so if the PR was from my-feature to master, base branch's
      // ref is master.
      if (!config.getRemoteScreenshotConfiguration) {
        throw new SevereServiceError('config is missing getRemoteScreenshotConfiguration');
      }
      const prBaseBranch = await this.getPrBaseBranchRef();
      const screenshotConfig = config.getRemoteScreenshotConfiguration(config.screenshotsSites, prBaseBranch);
      const screenshotRequestor = new ScreenshotRequestor(screenshotConfig.publishScreenshotConfiguration);
      await screenshotRequestor.upload();
    }
  }
}

module.exports = {
  OctokitRequestFailureError,
  TerraService,
};
