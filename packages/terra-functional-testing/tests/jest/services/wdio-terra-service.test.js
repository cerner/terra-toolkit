const fs = require('fs-extra');
const { URL } = require('url');
const { SevereServiceError } = require('webdriverio');
const {
  OctokitRequestFailureError,
  TerraService: WdioTerraService,
} = require('../../../src/services/wdio-terra-service');
const { setViewport, createOctokit, ScreenshotRequestor } = require('../../../src/commands/utils');
const { BUILD_BRANCH, BUILD_TYPE } = require('../../../src/constants/index');

jest.mock('fs-extra');
jest.mock('url');
jest.mock('../../../src/commands/utils');

URL.mockImplementation(() => ({
  pathname: 'cerner/repo-url',
}));

fs.readJsonSync.mockReturnValue({
  repository: {
    url: 'git+https://github.com/cerner/repo-url',
  },
});

const mockIsExisting = jest.fn().mockImplementation(() => true);
const element = {
  waitForExist: () => { },
  isExisting: mockIsExisting,
};

const mockFindElement = jest.fn().mockImplementation(() => element);
const TerraService = () => { };
const serviceOptions = { formFactor: 'huge' };
const config = {
  serviceOptions: {
    selector: 'mock-selector',
  },
  launcherOptions: {
    theme: 'mock-theme',
    formFactor: 'huge',
  },
};

const capabilities = { browserName: 'chrome' };

global.browser = {
  $: mockFindElement,
  options: {
    services: [[TerraService, serviceOptions]],
  },
  config: {
    waitforTimeout: 10000,
  },
};

global.Terra = {};

describe('WDIO Terra Service', () => {
  it('should setup the global terra object in before hook', () => {
    const service = new WdioTerraService({}, {}, config);

    service.before(capabilities);

    expect(global.Terra.validates.accessibility).toBeDefined();
    expect(global.Terra.validates.element).toBeDefined();
    expect(global.Terra.validates.screenshot).toBeDefined();
    expect(global.Terra.hideInputCaret).toBeDefined();
    expect(global.Terra.setApplicationLocale).toBeDefined();
    expect(setViewport).toHaveBeenCalledWith(service.serviceOptions.formFactor);
  });

  it('should setup the global terra axe configuration', () => {
    const rules = {
      'scrollable-region-focusable': { enabled: false },
      'color-contrast': { enabled: true },
    };

    expect(global.Terra.axe).toEqual({ rules });
  });

  it('should disable the axe color contrast rule for lowlight theme', () => {
    const service = new WdioTerraService({}, {}, { launcherOptions: { theme: 'clinical-lowlight-theme' } });

    service.before(capabilities);

    const rules = {
      'scrollable-region-focusable': { enabled: false },
      'color-contrast': { enabled: false },
    };

    expect(global.Terra.axe).toEqual({ rules });
  });

  it('should wait for browser interaction for IE', () => {
    const service = new WdioTerraService();

    service.before({ browserName: 'internet explorer' });

    expect(mockFindElement).toHaveBeenCalledWith('body');
  });

  it('should hide input caret after command', () => {
    const service = new WdioTerraService();

    service.before(capabilities);

    const mockHideInputCaret = jest.fn();
    global.Terra.hideInputCaret = mockHideInputCaret;

    service.afterCommand('url', [], 0, undefined);

    expect(mockHideInputCaret).toHaveBeenCalledWith('body');
    expect(mockFindElement).toHaveBeenCalledWith('[data-terra-test-loading]');
  });

  it('should define commands in beforeSession with no serviceOptions', () => {
    const service = new WdioTerraService();
    const expectedServiceOptions = {
      selector: '[data-terra-test-content] *:first-child',
    };

    service.beforeSession();
    expect(global.Terra.describeViewports).toBeDefined();
    expect(global.Terra.viewports).toBeDefined();
    expect(global.Terra.serviceOptions).toEqual(expectedServiceOptions);
  });

  it('should set service options with empty config', () => {
    const service = new WdioTerraService();
    const expectedServiceOptions = {
      selector: '[data-terra-test-content] *:first-child',
    };

    expect(service.serviceOptions).toEqual(expectedServiceOptions);
  });

  it('should set service options with populated config', () => {
    const service = new WdioTerraService({}, {}, config);
    const expectedServiceOptions = {
      formFactor: 'huge',
      selector: 'mock-selector',
      theme: 'mock-theme',
    };

    expect(service.serviceOptions).toEqual(expectedServiceOptions);
  });

  it('should define all commands', () => {
    const service = new WdioTerraService({}, {}, config);

    const expectedServiceOptions = {
      formFactor: 'huge',
      selector: 'mock-selector',
      theme: 'mock-theme',
    };

    service.beforeSession();
    service.before(capabilities);

    expect(setViewport).toBeCalled();
    expect(global.Terra.viewports).toBeDefined();
    expect(global.Terra.describeViewports).toBeDefined();
    expect(global.Terra.hideInputCaret).toBeDefined();
    expect(global.Terra.serviceOptions).toEqual(expectedServiceOptions);
  });

  describe('Screenshot stuff', () => {
    // Mocking out this method lets us test github API scenarios.
    // The result and error object structures are documented at https://github.com/octokit/request.js/#request.
    // Note: mockRe*edValueOnce() takes priority over mockRe*edValue().
    const octokitResult = {
      status: 200,
    };
    const octokitError = {
      status: 404,
    };
    const octokitRequest = jest.fn();
    createOctokit.mockImplementation(() => ({
      request: octokitRequest,
    }));

    // Adding all the stuff we need to test remote screenshot config.
    const rsConfig = {
      ...config,
      screenshotsSites: {
        repositoryId: 'mock-repositoryId',
        repositoryUrl: 'mock-repositoryUrl',
      },
      getRemoteScreenshotConfiguration: jest.fn(() => ({ publishScreenshotConfiguration: 1 })),
    };

    const gitApiUrl = 'https://example.com/github-api';
    const gitToken = 'token';
    const buildUrl = 'https://example.com/buildurl';

    // Creates a sane wdio service that will upload screenshots. Mangle the service options to test
    // various scenarios.
    const createWdioTerraService = (additionalServiceOptions = {}) => new WdioTerraService({}, {}, {
      serviceOptions: {
        buildBranch: BUILD_BRANCH.master,
        buildType: BUILD_TYPE.branchEventCause,
        buildUrl,
        gitApiUrl,
        gitToken,
        issueNumber: '101',
        useRemoteReferenceScreenshots: true,
        ...additionalServiceOptions,
      },
    });

    describe('OctokitRequestFailureError', () => {
      it('is a SevereServiceError with stringified, formatted error object', () => {
        expect(() => {
          throw new OctokitRequestFailureError(octokitError);
        }).toThrow(new SevereServiceError(JSON.stringify(octokitError, null, 4)));
      });
    });

    describe('github API calls', () => {
      describe('createOctokit', () => {
        it('Creates the octokit using the service options', () => {
          const service = createWdioTerraService();
          service.createOctokit();
          // Note: createOctokit is the mock above, not the service instance's method.
          expect(createOctokit)
            .toHaveBeenCalledWith(
              service.serviceOptions.gitApiUrl,
              service.serviceOptions.gitToken,
            );
        });

        it('Throws a SevereServiceError if gitApiUrl is missing', () => {
          expect(() => {
            createWdioTerraService({ gitApiUrl: undefined }).createOctokit();
          }).toThrowError(new SevereServiceError('config.serviceOptions is missing gitApiUrl'));
        });

        it('Throws a SevereServiceError if gitToken is missing', () => {
          expect(() => {
            createWdioTerraService({ gitToken: undefined }).createOctokit();
          })
            .toThrowError(new SevereServiceError('config.serviceOptions is missing gitToken'));
        });

        it('Throws a SevereServiceError if issueNumber is missing', () => {
          expect(() => {
            createWdioTerraService({ issueNumber: undefined }).createOctokit();
          }).toThrowError(new SevereServiceError('config.serviceOptions is missing issueNumber'));
        });
      });

      describe('getPrBaseBranchRef', () => {
        it('returns the ref as a string', async () => {
          octokitRequest.mockResolvedValue({
            ...octokitResult,
            data: {
              base: {
                ref: 'the-base-branch',
              },
            },
          });
          await expect(createWdioTerraService().getPrBaseBranchRef())
            .resolves
            .toBe('the-base-branch');
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });

        it('throws a SevereServiceError if the octokit request fails', async () => {
          octokitRequest.mockRejectedValue(octokitError);
          await expect(createWdioTerraService().getPrBaseBranchRef())
            .rejects
            .toThrowError(new OctokitRequestFailureError(octokitError));
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });

        it('throws a SevereServiceError if parsing the response fails', async () => {
          octokitRequest.mockResolvedValue({
            ...octokitResult,
            data: 'will cause a problem when parsed',
          });
          await expect(createWdioTerraService().getPrBaseBranchRef())
            .rejects
            .toThrowError(SevereServiceError);
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });
      });

      describe('getIssueComments', () => {
        it('returns the list of comment bodies', async () => {
          octokitRequest.mockResolvedValue({
            ...octokitResult,
            data: [{ body: 'comment 1' }, { body: 'comment 2' }],
          });
          await expect(createWdioTerraService().getIssueComments())
            .resolves
            .toStrictEqual(['comment 1', 'comment 2']);
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });

        it('throws a SevereServiceError if the octokit request fails', async () => {
          octokitRequest.mockRejectedValue(octokitError);
          await expect(createWdioTerraService().getIssueComments())
            .rejects
            .toThrowError(new OctokitRequestFailureError(octokitError));
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });

        it('throws a SevereServiceError if parsing the response fails', async () => {
          octokitRequest.mockResolvedValue({
            ...octokitResult,
            data: 'will cause a problem when parsed',
          });
          await expect(createWdioTerraService().getIssueComments())
            .rejects
            .toThrowError(SevereServiceError);
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });
      });

      describe('postIssueComment', () => {
        it('posts', async () => {
          octokitRequest.mockResolvedValue(octokitResult);
          await expect(createWdioTerraService().postIssueComment('comment 1'))
            .resolves
            .toStrictEqual(octokitResult);
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });

        it('throws a SevereServiceError if the octokit request fails', async () => {
          octokitRequest.mockRejectedValue(octokitError);
          await expect(createWdioTerraService().postIssueComment('comment 1'))
            .rejects
            .toThrowError(new OctokitRequestFailureError(octokitError));
          expect(octokitRequest).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('uploading screenshots', () => {
      const screenshotRequestorUpload = jest.fn();
      const screenshotRequestorDownload = jest.fn();
      ScreenshotRequestor.mockImplementation(() => ({
        upload: screenshotRequestorUpload,
        download: screenshotRequestorDownload,
      }));

      describe('onPrepare', () => {
        it('should download the PR\'s base branch screenshots', async () => {
          const service = createWdioTerraService();
          service.getPrBaseBranchRef = jest.fn().mockResolvedValue('the-branch-the-pr-will-merge-into');
          await service.onPrepare(rsConfig);
          expect(screenshotRequestorDownload).toHaveBeenCalled();
        });

        it('should stop the runner if getting the base branch name fails', async () => {
          const service = createWdioTerraService();
          service.getPrBaseBranchRef = jest.fn(() => { throw new SevereServiceError('oh no!'); });

          await expect(service.onPrepare(rsConfig))
            .rejects
            .toThrowError(new SevereServiceError('oh no!'));
        });
      });

      describe('onComplete', () => {
        it('should upload screenshots', async () => {
          const service = createWdioTerraService();
          service.getPrBaseBranchRef = jest.fn().mockResolvedValue('the-branch-the-pr-will-merge-into');
          await service.onComplete({}, rsConfig);
          expect(screenshotRequestorUpload).toHaveBeenCalled();
        });

        it('should not upload screenshots if buildBranch is a pullRequest', async () => {
          await createWdioTerraService({
            buildBranch: 'pr-31',
          }).onComplete({}, rsConfig);
          expect(screenshotRequestorUpload).not.toHaveBeenCalled();
        });

        it('should not upload screenshots if buildType is not BranchEventCause', async () => {
          await createWdioTerraService({
            buildType: undefined,
          }).onComplete({}, rsConfig);
          expect(screenshotRequestorUpload).not.toHaveBeenCalled();
        });
      });
    });

    describe('commenting once on a pr if there is a mismatch during onComplete', () => {
      const OLD_ENV = process.env;
      const createWdioTerraServiceForCommenting = () => createWdioTerraService({
        buildBranch: 'pr-31',
      });

      beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
        process.env.SCREENSHOT_MISMATCH_CHECK = true;
      });

      afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
      });

      it('should post to github when the comment does not exist on the PR', async () => {
        const service = createWdioTerraServiceForCommenting();
        service.getIssueComments = jest.fn().mockResolvedValue(['comment 1']);
        service.postIssueComment = jest.fn().mockResolvedValue();

        await service.onComplete({}, rsConfig);
        expect(service.postIssueComment).toHaveBeenCalled();
      });

      it('should not post to github if comment already exists on the PR', async () => {
        const service = createWdioTerraServiceForCommenting();
        service.createMismatchWarningMessage = jest.fn(() => 'look out, a mismatch!');
        service.getIssueComments = jest.fn().mockResolvedValue('look out, a mismatch!');
        service.postIssueComment = jest.fn().mockResolvedValue();

        await service.onComplete({}, rsConfig);
        expect(service.getIssueComments).toHaveBeenCalled();
        expect(service.postIssueComment).not.toHaveBeenCalled();
      });

      it('should stop the runner without posting if getting the comments fails', async () => {
        const service = createWdioTerraServiceForCommenting();
        service.getIssueComments = jest.fn(() => { throw new SevereServiceError('oh no!'); });
        service.postIssueComment = jest.fn().mockResolvedValue();

        await expect(service.onComplete({}, {}))
          .rejects
          .toThrowError(new SevereServiceError('oh no!'));
        expect(service.getIssueComments).toHaveBeenCalled();
        expect(service.postIssueComment).not.toHaveBeenCalled();
      });

      it('should stop the runner if posting the comment fails', async () => {
        const service = createWdioTerraServiceForCommenting();
        service.getIssueComments = jest.fn().mockResolvedValue(['comment 1']);
        service.postIssueComment = jest.fn(() => { throw new SevereServiceError('oh no!'); });

        await expect(service.onComplete({}, {}))
          .rejects
          .toThrowError(new SevereServiceError('oh no!'));
      });
    });
  });
});
