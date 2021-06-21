jest.mock('webpack');
jest.mock('@cerner/terra-cli');
jest.mock('webpack-dev-server');

const http = require('http');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
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
      expect(server.baseUrl).toBeUndefined();
    });

    it('should initialize provided options', () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');

      const server = new WebpackServer({
        locale: 'mock',
        port: 'mock',
        theme: 'mock',
        baseUrl: '0.0.0.0:8080',
      });

      expect(server.config).toEqual('config');
      expect(server.host).toEqual('0.0.0.0');
      expect(server.port).toEqual('mock');
      expect(server.baseUrl).toEqual('0.0.0.0:8080');
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
        overrideTheme: 'lowlight',
      };

      const config = WebpackServer.config(options);

      expect(config).toEqual({ defaultLocale: 'en', p: true, defaultTheme: 'lowlight' });
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

  describe('start', () => {
    it('resolves', async () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation((arg1, callback) => {
        callback({ statusCode: 200 });
      });
      const mockStats = {
        hasErrors: jest.fn().mockImplementationOnce(() => false),
      };
      const compiler = {
        watch: jest.fn(),
        hooks: {
          done: {
            tap: jest.fn((arg1, callback) => {
              callback(mockStats);
            }),
          },
          failed: {
            tap: () => {},
          },
        },
        options: {
          devServer: {},
        },
      };
      webpack.mockReturnValue(compiler);

      const server = new WebpackServer();

      return expect(server.start()).resolves.toBeUndefined();
    });

    it('rejects if WebpackDevServer.listen errors', async () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      const compiler = {
        watch: jest.fn(),
        hooks: {
          done: {
            tap: () => {},
          },
          failed: {
            tap: () => {},
          },
        },
        options: {
          devServer: {},
        },
      };
      webpack.mockReturnValue(compiler);
      const mockMethod = jest.fn((arg1, arg2, callback) => {
        callback(true);
      });
      WebpackDevServer.mockImplementation(() => ({ listen: mockMethod }));

      const server = new WebpackServer();
      server.baseUrl = '0.0.0.0:8080';

      return expect(server.start()).rejects.toBe(true);
    });

    it('throws if http.get throws', () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation(() => {
        throw new Error();
      });
      const mockStats = {
        hasErrors: jest.fn().mockImplementationOnce(() => false),
      };
      const compiler = {
        watch: jest.fn(),
        hooks: {
          done: {
            tap: jest.fn((arg1, callback) => {
              try {
                callback(mockStats);
              } catch (e) {
                expect(e.message).toEqual('Failed to connect to url 0.0.0.0:8080. Check to ensure the selenium grid is stable');
              }
            }),
          },
          failed: {
            tap: () => {},
          },
        },
        options: {
          devServer: {},
        },
      };
      webpack.mockReturnValue(compiler);

      const server = new WebpackServer();
      server.baseUrl = '0.0.0.0:8080';

      server.start();
    });

    it('throws when it cannot contact server', () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation((arg1, callback) => {
        try {
          callback({ statusCode: 300 });
        } catch (e) {
          expect(e.message).toEqual('Url 0.0.0.0:8080 returns status code of 300. Check to ensure the selenium grid is stable');
        }
      });
      const mockStats = {
        hasErrors: jest.fn().mockImplementationOnce(() => false),
      };
      const compiler = {
        watch: jest.fn(),
        hooks: {
          done: {
            tap: jest.fn((arg1, callback) => {
              callback(mockStats);
            }),
          },
          failed: {
            tap: () => {},
          },
        },
        options: {
          devServer: {},
        },
      };
      webpack.mockReturnValue(compiler);

      const server = new WebpackServer();
      server.baseUrl = '0.0.0.0:8080';

      server.start();
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
