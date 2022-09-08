const fs = require('fs-extra');
const { URL } = require('url');
const { SevereServiceError } = require('webdriverio');
const {
  OctokitRequestFailureError,
  TerraService: WdioTerraService,
} = require('../../../src/services/wdio-terra-service');
const { setViewport, createOctokit } = require('../../../src/commands/utils');
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

    describe('OctokitRequestFailureError', () => {
      it('is a SevereServiceError with stringified, formatted error object', () => {
        expect(() => {
          throw new OctokitRequestFailureError(octokitError);
        }).toThrow(new SevereServiceError(JSON.stringify(octokitError, null, 4)));
      });
    });

    it('should upload screenshots in onComplete', async () => {
      const localConfig = {
        serviceOptions: {
          selector: 'mock-selector',
          useRemoteReferenceScreenshots: true,
          buildBranch: BUILD_BRANCH.master,
          buildType: BUILD_TYPE.branchEventCause,
        },
      };
      octokitRequest.mockResolvedValueOnce({
        ...octokitResult,
        data: {
          base: {
            ref: 'the-branch-the-pr-will-merge-into',
          },
        },
      });
      const service = new WdioTerraService({}, {}, localConfig);
      await service.onComplete({}, rsConfig);
      expect(rsConfig.getRemoteScreenshotConfiguration).toHaveBeenCalledWith(rsConfig.screenshotsSites, 'the-branch-the-pr-will-merge-into');
    });

    it('should not upload screenshots in onComplete if buildBranch is a pullRequest', async () => {
      const localConfig = {
        serviceOptions: {
          selector: 'mock-selector',
          useRemoteReferenceScreenshots: true,
          buildBranch: 'pr-31',
          buildType: BUILD_TYPE.branchEventCause,
        },
      };
      const service = new WdioTerraService({}, {}, localConfig);
      await service.onComplete({}, rsConfig);
      expect(rsConfig.getRemoteScreenshotConfiguration).not.toHaveBeenCalled();
    });

    it('should not upload screenshots in onComplete if buildType is not BranchEventCause', async () => {
      const localConfig = {
        serviceOptions: {
          selector: 'mock-selector',
          useRemoteReferenceScreenshots: true,
          buildBranch: BUILD_BRANCH.master,
          buildType: undefined,
        },
      };
      const service = new WdioTerraService({}, {}, localConfig);
      await service.onComplete({}, rsConfig);
      expect(rsConfig.getRemoteScreenshotConfiguration).not.toHaveBeenCalled();
    });

    describe('github comment onComplete', () => {
      const OLD_ENV = process.env;

      beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
      });

      afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
      });

      it('should post to github', async () => {
        process.env.SCREENSHOT_MISMATCH_CHECK = true;
        const localConfig = {
          serviceOptions: {
            selector: 'mock-selector',
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-31',
            buildType: BUILD_TYPE.branchEventCause,
            buildUrl: 'buildurl',
            gitToken: 'token',
            gitApiUrl: 'gitapiurl',
            issueNumber: '101',
          },
        };

        const service = new WdioTerraService({}, {}, localConfig);

        octokitRequest.mockResolvedValueOnce({
          ...octokitResult,
          data: [],
        }).mockResolvedValueOnce(octokitResult);

        await service.onComplete({}, rsConfig);
        expect(octokitRequest.mock.calls.length).toBe(2);
        expect(rsConfig.getRemoteScreenshotConfiguration).not.toHaveBeenCalled();
      });

      it('should not post to github if comment already exists', async () => {
        process.env.SCREENSHOT_MISMATCH_CHECK = true;
        const localConfig = {
          serviceOptions: {
            selector: 'mock-selector',
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-31',
            buildType: BUILD_TYPE.branchEventCause,
            buildUrl: 'buildurl',
            gitToken: 'token',
            gitApiUrl: 'gitapiurl',
            issueNumber: '101',
          },
        };

        const msg = [
          ':warning: :bangbang: **WDIO MISMATCH** \n\n',
          `Check that screenshot change is intended at: ${localConfig.serviceOptions.buildUrl} \n\n`,
          'If screenshot change is intended, remote reference screenshots will be updated upon PR merge. \n',
          'If screenshot change is unintended, please fix screenshot issues before PR merge to prevent them from being uploaded. \n\n',
          'Note: This comment only appears the first time a screenshot mismatch is detected on a PR build, ',
          'future builds will need to be checked for unintended screenshot mismatchs.',
        ].join('');

        octokitRequest.mockResolvedValue({
          ...octokitResult,
          data: [{ body: msg }],
        });
        const service = new WdioTerraService({}, {}, localConfig);
        await service.onComplete({}, rsConfig);
        expect(octokitRequest.mock.calls.length).toBe(1);
        expect(rsConfig.getRemoteScreenshotConfiguration).not.toHaveBeenCalledWith();
      });

      it('should throw an error if posting comment returned non-200 status code', async () => {
        process.env.SCREENSHOT_MISMATCH_CHECK = true;
        const localConfig = {
          serviceOptions: {
            selector: 'mock-selector',
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-31',
            buildType: BUILD_TYPE.branchEventCause,
            buildUrl: 'buildurl',
            gitToken: 'token',
            gitApiUrl: 'gitapiurl',
            issueNumber: '101',
          },
        };

        // Getting the comment succedes, but posting fails.
        octokitRequest.mockResolvedValueOnce({
          data: [],
        }).mockRejectedValueOnce(octokitError);
        const service = new WdioTerraService({}, {}, localConfig);

        await expect(service.onComplete({}, {})).rejects.toThrowError(new OctokitRequestFailureError(octokitError));
        expect(octokitRequest.mock.calls.length).toBe(2);
      });

      it('should throw an error, if gitToken is not defined', async () => {
        process.env.SCREENSHOT_MISMATCH_CHECK = true;
        const localConfig = {
          serviceOptions: {
            selector: 'mock-selector',
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-31',
            buildType: BUILD_TYPE.branchEventCause,
            buildUrl: 'buildurl',
            gitApiUrl: 'gitapiurl',
            issueNumber: '101',
          },
        };

        const service = new WdioTerraService({}, {}, localConfig);
        await expect(service.onComplete({}, {})).rejects.toThrow(SevereServiceError);
      });

      it('should throw an error, if gitApiUrl is not defined', async () => {
        process.env.SCREENSHOT_MISMATCH_CHECK = true;
        const localConfig = {
          serviceOptions: {
            selector: 'mock-selector',
            useRemoteReferenceScreenshots: true,
            buildBranch: 'pr-31',
            buildType: BUILD_TYPE.branchEventCause,
            buildUrl: 'buildurl',
            gitToken: 'token',
            issueNumber: '101',
          },
        };

        const service = new WdioTerraService({}, {}, localConfig);
        await expect(service.onComplete({}, {})).rejects.toThrow(SevereServiceError);
      });
    });
  });
});
