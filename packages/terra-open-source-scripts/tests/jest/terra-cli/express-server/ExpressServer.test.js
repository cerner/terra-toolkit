jest.mock('@cerner/terra-cli/lib/utils/Logger');

const fs = require('fs-extra');
const ExpressServer = require('../../../../src/terra-cli/express-server/ExpressServer');

jest.mock('express', () => {
  const express = jest.fn(() => ({
    use: jest.fn(),
    listen: jest.fn().mockImplementation((_host, _port, callback) => { callback(); }),
  }));

  express.static = jest.fn(() => 'MOCK_EXPRESS_STATIC');

  return express;
});

describe('Express Server', () => {
  describe('constructor', () => {
    it('should initialize default options', () => {
      const server = new ExpressServer();

      expect(server.host).toBeUndefined();
      expect(server.port).toBeUndefined();
      expect(server.site).toBeUndefined();
    });

    it('should initialize provided options', () => {
      const server = new ExpressServer({ host: 'mock', port: 'mock', site: 'mock' });

      expect(server.host).toEqual('mock');
      expect(server.port).toEqual('mock');
      expect(server.site).toEqual('mock');
    });
  });

  describe('createApp', () => {
    it('should create and return an express app', () => {
      const server = new ExpressServer();

      const app = server.createApp();

      expect(app.use).toHaveBeenCalledTimes(2);
    });
  });

  describe('start', () => {
    it('should reject if the site directory does not exist', () => {
      const server = new ExpressServer();

      jest.spyOn(fs, 'pathExists').mockResolvedValueOnce(false);

      return expect(server.start()).rejects.toThrow();
    });

    it('should reject if the site directory exists but is empty', () => {
      const server = new ExpressServer();

      jest.spyOn(fs, 'pathExists').mockResolvedValueOnce(true);
      jest.spyOn(fs, 'lstat').mockResolvedValueOnce({ isDirectory: () => true });
      jest.spyOn(fs, 'readdir').mockResolvedValueOnce([]);

      return expect(server.start()).rejects.toThrow();
    });

    it('should start an express server', () => {
      const server = new ExpressServer();

      jest.spyOn(fs, 'pathExists').mockResolvedValueOnce(true);
      jest.spyOn(fs, 'lstat').mockResolvedValueOnce({ isDirectory: () => true });
      jest.spyOn(fs, 'readdir').mockResolvedValueOnce([0, 1]);

      return expect(server.start()).resolves.toBeUndefined();
    });
  });

  describe('stop', () => {
    it('should resolve immediately if there is not an active server', () => {
      const server = new ExpressServer();

      return expect(server.stop()).resolves.toBeUndefined();
    });

    it('should stop the active server', async () => {
      const server = new ExpressServer();

      const mockClose = jest.fn().mockImplementation(callback => { callback(); });

      server.server = { close: mockClose };

      await server.stop();

      expect(mockClose).toHaveBeenCalled();
    });
  });
});
