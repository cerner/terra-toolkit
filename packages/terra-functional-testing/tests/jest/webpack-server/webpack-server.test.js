jest.mock('webpack');
jest.mock('../../../src/logger/logger');

const path = require('path');
const WebpackServer = require('../../../src/webpack-server/webpack-server');

const mockWebpackSpy = jest.fn();

jest.mock('./mock-webpack.config.js', () => mockWebpackSpy);

describe('Webpack Server', () => {
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize default options', () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');

      const server = new WebpackServer();

      expect(server.config).toEqual('config');
      expect(server.host).toEqual('0.0.0.0');
      expect(server.port).toEqual('8080');
    });

    it('should initialize provided options', () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');

      const server = new WebpackServer({ locale: 'mock', port: 'mock', theme: 'mock' });

      expect(server.config).toEqual('config');
      expect(server.host).toEqual('0.0.0.0');
      expect(server.port).toEqual('mock');
    });
  });

  describe('config', () => {
    it('should return the webpack configuration', () => {
      jest.mock('./mock-webpack.config.js', () => 'mock-webpack');

      const options = {
        webpackConfig: path.resolve(__dirname, './mock-webpack.config.js'),
      };

      expect(WebpackServer.config(options)).toEqual('mock-webpack');
    });

    it('should execute the webpack configuration if exported as a function', () => {
      jest.mock('./mock-webpack.config.js', () => () => 'mock-webpack-function');

      const options = {
        webpackConfig: path.resolve(__dirname, './mock-webpack.config.js'),
      };

      expect(WebpackServer.config(options)).toEqual('mock-webpack-function');
    });

    it('should invoke the webpack configuration with env and arguments', () => {
      jest.mock('./mock-webpack.config.js', () => (env, args) => ({ ...env, ...args }));

      const options = {
        webpackConfig: path.resolve(__dirname, './mock-webpack.config.js'),
        locale: 'en',
        theme: 'lowlight',
      };

      const config = WebpackServer.config(options);

      expect(config).toEqual({ defaultLocale: 'en', p: true, theme: 'lowlight' });
    });
  });

  describe('watch', () => {
    it('should return a custom watch function', () => {
      const mockWatch = jest.fn().mockImplementation(() => ({}));
      const mockCompiler = {
        watch: mockWatch,
      };

      const watch = WebpackServer.watch(mockCompiler);

      watch(jest.fn());

      expect(mockWatch).toHaveBeenCalled();
      expect(typeof watch).toEqual('function');
    });
  });

  describe('stop', () => {
    it('should resolve immediately if there is not an active server', () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');

      const server = new WebpackServer();

      return expect(server.stop()).resolves.toBeUndefined();
    });

    it('should stop the active server', async () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');

      const server = new WebpackServer();

      const mockClose = jest.fn().mockImplementation(callback => { callback(); });

      server.server = { close: mockClose };

      await server.stop();

      expect(mockClose).toHaveBeenCalled();
    });
  });
});
