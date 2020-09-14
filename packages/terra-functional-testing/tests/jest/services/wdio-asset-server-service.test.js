jest.mock('../../../src/logger/logger');

const AssetService = require('../../../src/services/wdio-asset-server-service');
const ExpressServer = require('../../../src/express-server/express-server');
const WebpackServer = require('../../../src/webpack-server/webpack-server');

jest.mock('../../../src/express-server/express-server');
jest.mock('../../../src/webpack-server/webpack-server');

describe('WDIO Asset Server Service', () => {
  describe('constructor', () => {
    it('should initialize with the provided options', () => {
      const service = new AssetService({ mock: 'options' });

      expect(service.options).toEqual({ mock: 'options' });
    });
  });

  describe('onPrepare', () => {
    it('should return early if no site or config was provided', async () => {
      const service = new AssetService();

      await service.onPrepare();

      expect(service.server).toBeUndefined();
    });

    it('should start an express server if provided a site configuration option', async () => {
      const service = new AssetService({ site: './build' });

      await service.onPrepare();

      expect(ExpressServer).toHaveBeenCalledTimes(1);
    });

    it('should start a webpack server if provided a config configuration option', async () => {
      const service = new AssetService({ webpackConfig: 'webpack.config.js' });

      await service.onPrepare();

      expect(WebpackServer).toHaveBeenCalledTimes(1);
    });

    it('should throw a SevereServiceError if the server fails to start', async () => {
      const service = new AssetService({ webpackConfig: 'webpack.config.js' });

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
