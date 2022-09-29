const fs = require('fs-extra');
const { SevereServiceError } = require('webdriverio');

const WDIOTerraService = require('../../../../src/services/wdio-terra-service/WDIOTerraService');
const GithubIssue = require('../../../../src/services/wdio-terra-service/GithubIssue');
const GithubPr = require('../../../../src/services/wdio-terra-service/GithubPr');
const { setViewport, ScreenshotRequestor } = require('../../../../src/commands/utils');
const { BUILD_TYPE } = require('../../../../src/constants/index');

jest.mock('../../../../src/commands/utils');
jest.mock('fs-extra');
const repoOwner = 'acme';
const repoName = 'a-repo';
fs.readJson.mockResolvedValue({
  repository: {
    url: `git+https://github.com/${repoOwner}/${repoName}`,
  },
});

describe('WDIO Terra Service', () => {
  describe('getRepoMetadata', () => {
    it('returns a metadata object from the parsed package.json file', async () => {
      const metadata = await WDIOTerraService.getRepoMetadata();
      expect(metadata.owner).toBe(repoOwner);
      expect(metadata.name).toBe(repoName);
    });
  });

  describe('before hook', () => {
    let capabilities;
    let config;
    let element;
    let mockFindElement;

    beforeAll(() => {
      capabilities = { browserName: 'chrome' };
      element = {
        waitForExist: jest.fn(),
      };
      mockFindElement = jest.fn().mockImplementation(() => element);
      config = {
        serviceOptions: {
          formFactor: 'huge',
        },
      };
    });

    beforeEach(() => {
      global.Terra = {};
      global.browser = {
        $: mockFindElement,
        options: {
          services: [[jest.fn(), config.serviceOptions]],
        },
        config: {
          waitforTimeout: 10000,
        },
      };
    });

    afterEach(() => {
      global.Terra = undefined;
      global.browser = undefined;
    });

    it('Defines the Terra global object', () => {
      const service = new WDIOTerraService({}, {}, config);
      service.before(capabilities);

      expect(global.Terra.setApplicationLocale).toBeDefined();
      expect(global.Terra.hideInputCaret).toBeDefined();
      expect(global.Terra.validates).toBeDefined();

      expect(global.Terra.validates.accessibility).toBeDefined();
      expect(global.Terra.validates.element).toBeDefined();
      expect(global.Terra.validates.screenshot).toBeDefined();
      expect(global.Terra.axe).toBeDefined();

      expect(setViewport).toHaveBeenCalledWith(service.serviceOptions.formFactor);
    });

    it('Defines the Terra.axe object', () => {
      const service = new WDIOTerraService({}, {}, config);
      service.before(capabilities);

      const rules = {
        'scrollable-region-focusable': { enabled: false },
        'color-contrast': { enabled: true },
      };

      expect(global.Terra.axe).toEqual({ rules });
    });

    it('Disables the axe color contrast rule for lowlight theme', () => {
      const service = new WDIOTerraService({}, {}, {
        launcherOptions: {
          theme: 'clinical-lowlight-theme',
        },
      });
      service.before(capabilities);

      expect(global.Terra.axe).toEqual({
        rules: {
          'scrollable-region-focusable': { enabled: false },
          'color-contrast': { enabled: false },
        },
      });
    });

    it('Waits for browser interaction for IE', () => {
      const service = new WDIOTerraService();
      service.before({ browserName: 'internet explorer' });

      expect(mockFindElement).toHaveBeenCalledWith('body');
    });

    it('Hides the input caret after command', () => {
      const service = new WDIOTerraService();
      service.before(capabilities);
      const mockHideInputCaret = jest.fn();
      global.Terra.hideInputCaret = mockHideInputCaret;
      service.afterCommand('url', [], 0, undefined);

      expect(mockHideInputCaret).toHaveBeenCalledWith('body');
      expect(mockFindElement).toHaveBeenCalledWith('[data-terra-test-loading]');
    });

    it('Defines commands in beforeSession with no serviceOptions', () => {
      const service = new WDIOTerraService();
      const expectedServiceOptions = {
        selector: '[data-terra-test-content] *:first-child',
      };
      service.beforeSession();

      expect(global.Terra.describeViewports).toBeDefined();
      expect(global.Terra.viewports).toBeDefined();
      expect(global.Terra.serviceOptions).toEqual(expectedServiceOptions);
    });

    it('Sets service options with empty config', () => {
      const service = new WDIOTerraService();
      const expectedServiceOptions = {
        selector: '[data-terra-test-content] *:first-child',
      };

      expect(service.serviceOptions).toEqual(expectedServiceOptions);
    });

    it('Sets service options with populated config', () => {
      const service = new WDIOTerraService({}, {}, config);
      const expectedServiceOptions = {
        formFactor: 'huge',
        selector: '[data-terra-test-content] *:first-child',
      };

      expect(service.serviceOptions).toEqual(expectedServiceOptions);
    });
  });

  describe('beforeSession hook', () => {
    it('Defines all commands', () => {
      const service = new WDIOTerraService();
      service.beforeSession();

      expect(global.Terra.serviceOptions).toBeDefined();
      expect(global.Terra.describeTests).toBeDefined();
      expect(global.Terra.describeViewports).toBeDefined();
      expect(global.Terra.viewports).toBeDefined();
    });
  });

  describe('onPrepare hook', () => {
    const baseBranchRef = 'the-base-branch';
    let config;
    let download;
    let getRemoteScreenshotConfiguration;

    beforeAll(() => {
      download = jest.spyOn(ScreenshotRequestor.prototype, 'download');
      getRemoteScreenshotConfiguration = jest.fn(() => ({
        publishScreenshotConfiguration: jest.fn(),
      }));
      jest.spyOn(GithubPr.prototype, 'getBaseBranchRef')
        .mockResolvedValue(baseBranchRef);
    });

    beforeEach(() => {
      // Happy path config.
      config = {
        getRemoteScreenshotConfiguration,
        screenshotsSites: 'screenshot sites object',
        serviceOptions: {
          useRemoteReferenceScreenshots: true,
          buildBranch: 'pr-123',
          buildType: BUILD_TYPE.branchEventCause,
        },
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('Download screenshots for a PR branch from the remote repo of the PR\'s base branch.', async () => {
      const service = new WDIOTerraService({}, {}, config);
      await service.onPrepare();
      expect(download).toHaveBeenCalled();
      expect(getRemoteScreenshotConfiguration).toHaveBeenCalledWith('screenshot sites object', baseBranchRef);
    });

    it('Download screenshots for a non-PR branch from the remote repo of the build branch.', async () => {
      const buildBranch = 'not-a-pull-request';
      config.serviceOptions.buildBranch = buildBranch;
      const service = new WDIOTerraService({}, {}, config);
      await service.onPrepare();
      expect(download).toHaveBeenCalled();
      expect(getRemoteScreenshotConfiguration).toHaveBeenCalledWith('screenshot sites object', buildBranch);
    });

    it('Does not download if not using remote screenshots.', async () => {
      config.serviceOptions.useRemoteReferenceScreenshots = false;
      const service = new WDIOTerraService({}, {}, config);
      await service.onPrepare();
      expect(download).not.toHaveBeenCalled();
    });

    it('Stops the service if something goes wrong while downloading', async () => {
      download.mockRejectedValue('oh no!');
      const service = new WDIOTerraService({}, {}, config);
      await expect(service.onPrepare()).rejects.toThrow(SevereServiceError);
      expect(download).toHaveBeenCalled();
    });
  });

  describe('onComplete hook', () => {
    let config;
    let getRemoteScreenshotConfiguration;

    beforeAll(() => {
      getRemoteScreenshotConfiguration = jest.fn(() => ({
        publishScreenshotConfiguration: jest.fn(),
      }));
    });

    beforeEach(() => {
      config = {
        getRemoteScreenshotConfiguration,
        screenshotsSites: 'screenshot sites object',
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    describe('Posting a mismatch warning comment to the github issue', () => {
      let postComment;
      let getComments;
      let buildUrl;
      let warningMessage;

      beforeAll(() => {
        postComment = jest.spyOn(GithubIssue.prototype, 'postComment');
        getComments = jest.spyOn(GithubIssue.prototype, 'getComments');
        buildUrl = 'https://example.com/buildUrl';
        warningMessage = [
          ':warning: :bangbang: **WDIO MISMATCH**\n\n',
          `Check that screenshot change is intended at: ${buildUrl}\n\n`,
          'If screenshot change is intended, remote reference screenshots will be updated upon PR merge.\n',
          'If screenshot change is unintended, please fix screenshot issues before PR merge to prevent them from being uploaded.\n\n',
          'Note: This comment only appears the first time a screenshot mismatch is detected on a PR build, ',
          'future builds will need to be checked for unintended screenshot mismatches.',
        ].join('');
      });

      beforeEach(() => {
        // Happy path environs and config.
        process.env.SCREENSHOT_MISMATCH_CHECK = true;
        config.serviceOptions = {
          useRemoteReferenceScreenshots: true,
          buildBranch: 'pr-123',
          buildUrl,
        };
      });

      afterAll(() => {
        process.env.SCREENSHOT_MISMATCH_CHECK = undefined;
      });

      it('Posts a comment', async () => {
        getComments.mockResolvedValue(['not the warning message']);
        postComment.mockResolvedValue();
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(postComment).toHaveBeenCalledWith(warningMessage);
      });

      it('Does not try to post if no mismatch has been found', async () => {
        process.env.SCREENSHOT_MISMATCH_CHECK = undefined;
        getComments.mockResolvedValue(['not the warning message']);
        postComment.mockResolvedValue();
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(postComment).not.toHaveBeenCalled();
      });

      it('Does not try to post if we are not using remote screenshots', async () => {
        config.serviceOptions.useRemoteReferenceScreenshots = false;
        getComments.mockResolvedValue(['not the warning message']);
        postComment.mockResolvedValue();
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(postComment).not.toHaveBeenCalled();
      });

      it('Does not try to post if the branch does not match the PR pattern', async () => {
        config.serviceOptions.buildBranch = 'not-a-pr';
        getComments.mockResolvedValue(['not the warning message']);
        postComment.mockResolvedValue();
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(postComment).not.toHaveBeenCalled();
      });

      it('Does not post if the comment is found on the issue', async () => {
        getComments.mockResolvedValue([warningMessage]);
        postComment.mockResolvedValue();
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(getComments).toHaveBeenCalled();
        expect(postComment).not.toHaveBeenCalled();
      });

      it('Stops the service without posting if it fails to get the issue comments', async () => {
        getComments.mockRejectedValue('oh no!');
        const service = new WDIOTerraService({}, {}, config);
        await expect(service.onComplete()).rejects.toThrow(SevereServiceError);
        expect(getComments).toHaveBeenCalled();
        expect(postComment).not.toHaveBeenCalled();
      });

      it('Stops the service if it fails to post the comment', async () => {
        getComments.mockResolvedValue(['not the warning message']);
        postComment.mockRejectedValue('oh no!');
        const service = new WDIOTerraService({}, {}, config);
        await expect(service.onComplete()).rejects.toThrow(SevereServiceError);
        expect(postComment).toHaveBeenCalled();
      });
    });

    describe('Uploading screenshots to a remote repo', () => {
      let upload;
      const buildBranch = 'not-a-pull-request';

      beforeAll(() => {
        upload = jest.spyOn(ScreenshotRequestor.prototype, 'upload');
      });

      beforeEach(() => {
        config.serviceOptions = {
          useRemoteReferenceScreenshots: true,
          buildBranch,
          buildType: BUILD_TYPE.branchEventCause,
        };
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      it('Uploads screenshots.', async () => {
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(upload).toHaveBeenCalled();
        expect(getRemoteScreenshotConfiguration).toHaveBeenCalledWith('screenshot sites object', buildBranch);
      });

      it('Does not upload if not using remote screenshots.', async () => {
        config.serviceOptions.useRemoteReferenceScreenshots = false;
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(upload).not.toHaveBeenCalled();
      });

      it('Does not upload if the build branch name matches the PR pattern.', async () => {
        config.serviceOptions.buildBranch = 'pr-123';
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(upload).not.toHaveBeenCalled();
      });

      it('Does not upload if the build type is not a branch event.', async () => {
        config.serviceOptions.buildType = undefined;
        const service = new WDIOTerraService({}, {}, config);
        await service.onComplete();
        expect(upload).not.toHaveBeenCalled();
      });

      it('Stops the service if something goes wrong while uploading', async () => {
        upload.mockRejectedValue('oh no!');
        const service = new WDIOTerraService({}, {}, config);
        await expect(service.onComplete()).rejects.toThrow(SevereServiceError);
        expect(upload).toHaveBeenCalled();
      });
    });
  });
});
