const { Logger } = require('@cerner/terra-cli');

jest.mock('webpack');
jest.mock('@cerner/terra-cli');
jest.mock('webpack-dev-server');

const http = require('http');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const WebpackServer = require('../../../src/webpack-server/webpack-server');

const mockLoggerInstance = Logger.mock.instances[0];
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
      expect(server.gridStatusUrl).toBeUndefined();
    });

    it('should initialize provided options', () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');

      const server = new WebpackServer({
        locale: 'mock',
        port: 'mock',
        theme: 'mock',
        gridUrl: '1.1.1.1',
      });

      expect(server.config).toEqual('config');
      expect(server.host).toEqual('0.0.0.0');
      expect(server.port).toEqual('mock');
      expect(server.gridStatusUrl).toEqual('http://1.1.1.1:80/status');
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
      const chunk = {
        value: {
          ready: true,
        },
      };
      const onfn = jest.fn()
        .mockImplementationOnce((event, cb) => cb(JSON.stringify(chunk)))
        .mockImplementationOnce((event, cb) => cb());
      const response = {
        statusCode: 200,
        on: onfn,
        complete: true,
      };
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation((arg1, callback) => {
        callback(response);
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
      server.gridStatusUrl = '1.1.1.1:8080';

      return expect(server.start()).resolves.toBeUndefined();
    });

    it('skips gridUrl check and resolves', async () => {
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
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
      server.gridStatusUrl = '0.0.0.0:8080';

      return expect(server.start()).rejects.toBe(true);
    });

    it('throws if grid is not ready', async () => {
      const chunk = {
        value: {
          ready: false,
        },
      };
      const onfn = jest.fn()
        .mockImplementationOnce((event, cb) => cb(JSON.stringify(chunk)))
        .mockImplementationOnce((event, cb) => cb());
      const response = {
        statusCode: 200,
        on: onfn,
        complete: true,
      };
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation((arg1, callback) => {
        callback(response);
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
      server.gridStatusUrl = '1.1.1.1:8080';
      await expect(server.start()).rejects.toBeUndefined();
      expect(mockLoggerInstance.error.mock.calls[0][0]).toEqual(`${server.gridStatusUrl} failed to return a ready response. Check to ensure the selenium grid is stable.`);
    });

    it('rejects if grid connection was terminated', async () => {
      const onfn = jest.fn()
        .mockImplementationOnce((event, cb) => cb())
        .mockImplementationOnce((event, cb) => cb());
      const response = {
        statusCode: 200,
        on: onfn,
        complete: false,
      };
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation((arg1, callback) => {
        callback(response);
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
      server.gridStatusUrl = '1.1.1.1:8080';

      await expect(server.start()).rejects.toBeUndefined();
      expect(mockLoggerInstance.error.mock.calls[0][0]).toEqual(`${server.gridStatusUrl} connection was terminated while the message was still being sent.`);
    });

    it('throws if http.get throws', async () => {
      const message = 'No internet';
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation(() => ({ on: jest.fn((arg1, callback) => callback({ message })) }));
      const mockStats = {
        hasErrors: jest.fn().mockImplementationOnce(() => false),
      };
      const compiler = {
        watch: jest.fn(),
        hooks: {
          done: {
            tap: jest.fn((arg1, callback) => callback(mockStats)),
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
      server.gridStatusUrl = 'http://0.0.0.0:80/status';

      await expect(server.start()).rejects.toBeUndefined();
      expect(mockLoggerInstance.error.mock.calls[0][0]).toEqual(`Failed to connect to url ${server.gridStatusUrl}. Error thrown: ${message}`);
    });

    it('throws when it cannot contact server', async () => {
      const resumeMock = jest.fn();
      jest.spyOn(WebpackServer, 'config').mockImplementation(() => 'config');
      jest.spyOn(http, 'get').mockImplementation((arg1, callback) => callback({ statusCode: 300, resume: resumeMock }));
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
      server.gridStatusUrl = '0.0.0.0:8080';

      await expect(server.start()).rejects.toBeUndefined();
      expect(mockLoggerInstance.error.mock.calls[0][0]).toEqual(`Url ${server.gridStatusUrl} returns status code of 300.`);
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
