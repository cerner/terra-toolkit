const fs = require('fs-extra');
const { SevereServiceError } = require('webdriverio');

const WDIOTerraService = require('../../../../src/services/wdio-terra-service/WDIOTerraService');
const GithubIssue = require('../../../../src/services/wdio-terra-service/GithubIssue');

const { setViewport, ScreenshotRequestor } = require('../../../../src/commands/utils');
const { BUILD_TYPE } = require('../../../../src/constants/index');

jest.mock('../../../../src/commands/utils');
jest.mock('fs-extra');
fs.readJson.mockResolvedValue({
  repository: {
    url: 'git+https://github.com/cerner/repo-url',
  },
});

describe('WDIO Terra Service', () => {
  describe('The global Terra object', () => {
    const capabilities = { browserName: 'chrome' };
    const element = {
      waitForExist: jest.fn(),
    };
    const mockFindElement = jest.fn().mockImplementation(() => element);
    const config = {
      serviceOptions: {
        formFactor: 'huge',
      },
    };

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

    it('should be defined in the before hook', () => {
      const service = new WDIOTerraService({}, {}, config);
      service.before(capabilities);

      expect(global.Terra.validates.accessibility).toBeDefined();
      expect(global.Terra.validates.element).toBeDefined();
      expect(global.Terra.validates.screenshot).toBeDefined();
      expect(global.Terra.hideInputCaret).toBeDefined();
      expect(global.Terra.setApplicationLocale).toBeDefined();
      expect(setViewport).toHaveBeenCalledWith(service.serviceOptions.formFactor);
    });

    it('should setup the global terra axe configuration', () => {
      const service = new WDIOTerraService({}, {}, config);
      service.before(capabilities);

      const rules = {
        'scrollable-region-focusable': { enabled: false },
        'color-contrast': { enabled: true },
      };

      expect(global.Terra.axe).toEqual({ rules });
    });

    it('should disable the axe color contrast rule for lowlight theme', () => {
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

    it('should wait for browser interaction for IE', () => {
      const service = new WDIOTerraService();
      service.before({ browserName: 'internet explorer' });

      expect(mockFindElement).toHaveBeenCalledWith('body');
    });

    it('should hide input caret after command', () => {
      const service = new WDIOTerraService();
      service.before(capabilities);
      const mockHideInputCaret = jest.fn();
      global.Terra.hideInputCaret = mockHideInputCaret;
      service.afterCommand('url', [], 0, undefined);

      expect(mockHideInputCaret).toHaveBeenCalledWith('body');
      expect(mockFindElement).toHaveBeenCalledWith('[data-terra-test-loading]');
    });

    it('should define commands in beforeSession with no serviceOptions', () => {
      const service = new WDIOTerraService();
      const expectedServiceOptions = {
        selector: '[data-terra-test-content] *:first-child',
      };
      service.beforeSession();

      expect(global.Terra.describeViewports).toBeDefined();
      expect(global.Terra.viewports).toBeDefined();
      expect(global.Terra.serviceOptions).toEqual(expectedServiceOptions);
    });

    it('should set service options with empty config', () => {
      const service = new WDIOTerraService();
      const expectedServiceOptions = {
        selector: '[data-terra-test-content] *:first-child',
      };

      expect(service.serviceOptions).toEqual(expectedServiceOptions);
    });

    it('should set service options with populated config', () => {
      const service = new WDIOTerraService({}, {}, config);
      const expectedServiceOptions = {
        formFactor: 'huge',
        selector: '[data-terra-test-content] *:first-child',
      };

      expect(service.serviceOptions).toEqual(expectedServiceOptions);
    });

    it('should define all commands', () => {
      const service = new WDIOTerraService({}, {}, config);
      service.beforeSession();
      service.before(capabilities);

      expect(setViewport).toBeCalled();
      expect(global.Terra.viewports).toBeDefined();
      expect(global.Terra.describeViewports).toBeDefined();
      expect(global.Terra.hideInputCaret).toBeDefined();
    });
  });

  describe('remote screenshots', () => {
    describe('onComplete', () => {
      let config;
      const upload = jest.spyOn(ScreenshotRequestor.prototype, 'upload');
      const postComment = jest.spyOn(GithubIssue.prototype, 'postComment');
      const getComments = jest.spyOn(GithubIssue.prototype, 'getComments');
      const buildUrl = 'https://example.com/buildUrl';
      const warningMessage = [
        ':warning: :bangbang: **WDIO MISMATCH**\n\n',
        `Check that screenshot change is intended at: ${buildUrl}\n\n`,
        'If screenshot change is intended, remote reference screenshots will be updated upon PR merge.\n',
        'If screenshot change is unintended, please fix screenshot issues before PR merge to prevent them from being uploaded.\n\n',
        'Note: This comment only appears the first time a screenshot mismatch is detected on a PR build, ',
        'future builds will need to be checked for unintended screenshot mismatches.',
      ].join('');

      beforeEach(() => {
        config = {
          getRemoteScreenshotConfiguration: jest.fn(() => ({
            publishScreenshotConfiguration: jest.fn(),
          })),
          serviceOptions: {
            buildUrl,
          },
        };
      });

      afterEach(() => {
        process.env.SCREENSHOT_MISMATCH_CHECK = undefined;
        jest.clearAllMocks();
      });

      describe('Posting a mismatch warning comment to the github issue', () => {
        it('Posts a comment', async () => {
          process.env.SCREENSHOT_MISMATCH_CHECK = 'true';
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-123',
          };

          getComments.mockResolvedValue(['not the warning message']);
          postComment.mockResolvedValue();

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(postComment).toHaveBeenCalledWith(warningMessage);
        });

        it('Does not try to post if we are not checking for screenshot mismatches', async () => {
          // Changed from happy path.
          process.env.SCREENSHOT_MISMATCH_CHECK = undefined;
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-123',
          };

          getComments.mockResolvedValue(['not the warning message']);
          postComment.mockResolvedValue();

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(postComment).not.toHaveBeenCalled();
        });

        it('Does not try to post we are not using remote screenshots', async () => {
          process.env.SCREENSHOT_MISMATCH_CHECK = 'true';
          config.serviceOptions = {
            ...config.serviceOptions,
            // Changed from happy path.
            useRemoteReferenceScreenshots: false,
            buildBranch: 'pr-123',
          };

          getComments.mockResolvedValue(['not the warning message']);
          postComment.mockResolvedValue();

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(postComment).not.toHaveBeenCalled();
        });

        it('Does not try to post if the branch does not match the PR pattern', async () => {
          process.env.SCREENSHOT_MISMATCH_CHECK = 'true';
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            // Changed from happy path.
            buildBranch: 'not-a-pr',
          };

          getComments.mockResolvedValue(['not the warning message']);
          postComment.mockResolvedValue();

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(postComment).not.toHaveBeenCalled();
        });

        it('Does not post if the comment is found on the issue', async () => {
          process.env.SCREENSHOT_MISMATCH_CHECK = 'true';
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-123',
            buildType: BUILD_TYPE.branchEventCause,
          };

          getComments.mockResolvedValue([warningMessage]);
          postComment.mockResolvedValue();

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(getComments).toHaveBeenCalled();
          expect(postComment).not.toHaveBeenCalled();
        });

        it('Stops the service without posting if it fails to get the issue comments', async () => {
          process.env.SCREENSHOT_MISMATCH_CHECK = 'true';
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-123',
          };

          getComments.mockRejectedValue('oh no!');
          const service = new WDIOTerraService({}, {}, config);
          await expect(service.onComplete()).rejects.toThrow(SevereServiceError);
          expect(getComments).toHaveBeenCalled();
          expect(postComment).not.toHaveBeenCalled();
        });

        it('Stops the service if it fails to post the comment', async () => {
          process.env.SCREENSHOT_MISMATCH_CHECK = 'true';
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-123',
          };

          getComments.mockResolvedValue(['not the warning message']);
          postComment.mockRejectedValue('oh no!');

          const service = new WDIOTerraService({}, {}, config);
          await expect(service.onComplete()).rejects.toThrow(SevereServiceError);
          expect(postComment).toHaveBeenCalled();
        });
      });

      describe('Uploading screenshots to a remote repo', () => {
        it('Uploads screenshots.', async () => {
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'not-a-pull-request',
            buildType: BUILD_TYPE.branchEventCause,
          };

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(upload).toHaveBeenCalled();
        });

        it('Does not upload if not using remote screenshots.', async () => {
          config.serviceOptions = {
            ...config.serviceOptions,
            // Changed from happy path.
            useRemoteReferenceScreenshots: false,
            buildBranch: 'not-a-pull-request',
            buildType: BUILD_TYPE.branchEventCause,
          };

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(upload).not.toHaveBeenCalled();
        });

        it('Does not upload if the build branch name matches the PR pattern.', async () => {
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            // Changed from happy path.
            buildBranch: 'pr-123',
            buildType: BUILD_TYPE.branchEventCause,
          };

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(upload).not.toHaveBeenCalled();
        });

        it('Does not upload if the build type is not a branch event.', async () => {
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'not-a-pull-request',
            // Changed from happy path.
            buildType: undefined,
          };

          const service = new WDIOTerraService({}, {}, config);
          await service.onComplete();
          expect(upload).not.toHaveBeenCalled();
        });

        it('Stops the service if something goes wrong while uploading', async () => {
          config.serviceOptions = {
            ...config.serviceOptions,
            useRemoteReferenceScreenshots: true,
            buildBranch: 'not-a-pull-request',
            buildType: BUILD_TYPE.branchEventCause,
          };
          upload.mockRejectedValue('oh no!');

          const service = new WDIOTerraService({}, {}, config);
          await expect(service.onComplete()).rejects.toThrow(SevereServiceError);
          expect(upload).toHaveBeenCalled();
        });
      });
    });
  });
});
