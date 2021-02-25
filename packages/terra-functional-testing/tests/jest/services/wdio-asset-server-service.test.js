jest.mock('@cerner/terra-cli');

const AssetService = require('../../../src/services/wdio-asset-server-service');
const ExpressServer = require('../../../src/express-server/express-server');
const WebpackServer = require('../../../src/webpack-server/webpack-server');

jest.mock('../../../src/express-server/express-server');
jest.mock('../../../src/webpack-server/webpack-server');

const config = {
  launcherOptions: {
    port: 8080,
    locale: 'en',
    site: './build',
    theme: 'default-theme',
    webpackConfig: 'webpack.config.js',
  },
};

describe('WDIO Asset Server Service', () => {
  describe('constructor', () => {
    it('should initialize with empty config', async () => {
      const service = new AssetService();

      expect(service.options).toEqual({});
    });

    it('should initialize with populated config', async () => {
      const service = new AssetService({}, {}, config);

      expect(service.options).toEqual(config.launcherOptions);
    });
  });

  describe('onPrepare', () => {
    it('should return early if no site or config was provided', async () => {
      const service = new AssetService();

      await service.onPrepare();

      expect(service.server).toBeUndefined();
    });

    it('should start an express server if provided a site configuration option', async () => {
      const service = new AssetService({}, {}, config);

      await service.onPrepare();

      expect(ExpressServer).toHaveBeenCalledTimes(1);
    });

    it('should start a webpack server if provided a config configuration option', async () => {
      const service = new AssetService({}, {}, { launcherOptions: { webpackConfig: 'webpack.config.js' } });

      await service.onPrepare();

      expect(WebpackServer).toHaveBeenCalledTimes(1);
    });

    it('should throw a SevereServiceError if the server fails to start', async () => {
      const service = new AssetService({}, {}, { launcherOptions: { webpackConfig: 'webpack.config.js' } });

      WebpackServer.mockImplementationOnce(() => ({
        start: () => Promise.reject(),
      }));

      try {
        await service.onPrepare();
      } catch (error) {
        expect(error.name).toEqual('SevereServiceError');
      }

      expect.assertions(1);
    });
  });

  describe('onComplete', () => {
    it('should stop the server', async () => {
      const service = new AssetService();

      const mockStop = jest.fn().mockImplementation(() => Promise.resolve());

      service.server = { stop: mockStop };

      await service.onComplete();

      expect(mockStop).toHaveBeenCalled();
      expect(service.server).toBeNull();
    });
  });
});
