jest.mock('../../../lib/logger/logger');

const fs = require('fs');
const ExpressServer = require('../../../lib/express-server/express-server');

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

      expect(server.host).toEqual('0.0.0.0');
      expect(server.port).toEqual('8080');
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
    it('should reject if the site directory does not exists', () => {
      const server = new ExpressServer();

      jest.spyOn(fs, 'existsSync').mockImplementation(() => false);

      return expect(server.start()).rejects.toBeUndefined();
    });

    it('should reject if the site directory exists but is empty', () => {
      const server = new ExpressServer();

      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
      jest.spyOn(fs, 'readdirSync').mockImplementation(() => []);

      return expect(server.start()).rejects.toBeUndefined();
    });

    it('should start an express server', () => {
      const server = new ExpressServer();

      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
      jest.spyOn(fs, 'readdirSync').mockImplementation(() => [0, 1]);

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
