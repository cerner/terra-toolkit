jest.mock('node-fetch');
jest.mock('archiver');
jest.mock('form-data');
jest.mock('extract-zip');
jest.mock('fs-extra');
jest.mock('../../../../src/commands/utils/MemoryStream');
const mockInfo = jest.fn();
const mockError = jest.fn();
jest.mock('@cerner/terra-cli/lib/utils/Logger', () => function mock() {
  return {
    info: mockInfo,
    error: mockError,
  };
});

const path = require('path');
const extract = require('extract-zip');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const archiver = require('archiver');
const FormData = require('form-data');
const MemoryStream = require('../../../../src/commands/utils/MemoryStream');
const ScreenshotRequestor = require('../../../../src/commands/utils/ScreenshotRequestor');

describe('ScreenshotRequestor', () => {
  const oldCwd = process.cwd;
  beforeEach(() => {
    mockInfo.mockClear();
    jest.resetModules();
  });

  beforeAll(() => {
    process.cwd = jest.fn();
    process.cwd.mockReturnValue('/app');
  });

  afterAll(() => {
    process.cwd = oldCwd;
  });

  describe('constructor', () => {
    it('should initialize ScreenshotRequestor', () => {
      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      expect(screenshotRequestor).toMatchSnapshot();
    });
  });

  describe('checkStatus', () => {
    it('should return the response when checkStatus is ok', () => {
      const response = {
        ok: true,
        status: 200,
      };
      expect(ScreenshotRequestor.checkStatus(response)).toEqual(response);
    });

    it('should return the response when checkStatus is not ok but has a valid status', () => {
      const response = {
        ok: false,
        status: 404,
        statusText: 'Not Found error',
      };
      expect(ScreenshotRequestor.checkStatus(response, [404])).toEqual(response);
    });

    it('should throw an error when checkStatus is not ok and status is not valid', () => {
      const response = {
        ok: false,
        status: 500,
        statusText: 'Internal Server error',
      };
      expect(() => ScreenshotRequestor.checkStatus(response, [404])).toThrowErrorMatchingSnapshot();
    });
  });

  describe('deleteExistingScreenshots', () => {
    it('should delete the existing screenshots', async () => {
      const oldCheckStatus = ScreenshotRequestor.checkStatus;
      ScreenshotRequestor.checkStatus = jest.fn();
      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await screenshotRequestor.deleteExistingScreenshots('mock');

      expect(fetch).toHaveBeenCalledWith(
        `${screenshotRequestor.serviceUrl}mock/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: screenshotRequestor.serviceAuthHeader,
          },
        },
      );
      expect(ScreenshotRequestor.checkStatus).toHaveBeenCalled();
      ScreenshotRequestor.checkStatus = oldCheckStatus;
      expect(mockInfo).toHaveBeenCalledWith('Existing screenshots deleted from remote repository.');
    });
  });

  describe('zipDirectoryToMemory', () => {
    it('zips the reference screenshots', async () => {
      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      const archiveName = path.join(screenshotRequestor.zipFilePath, 'latest.zip');

      const mockArchiver = {
        pipe: jest.fn(),
        file: jest.fn(),
        finalize: jest.fn(),
      };
      archiver.mockReturnValueOnce(mockArchiver);
      mockArchiver.finalize.mockResolvedValueOnce();

      const memoryStream = await screenshotRequestor.zipDirectoryToMemory();

      expect(memoryStream).toMatchSnapshot();
      expect(MemoryStream).toHaveBeenCalledWith({ highWaterMark: 10 * 1024 * 1024 * 1024 });
      const mockMemoryStreamInstance = MemoryStream.mock.instances[0];
      expect(mockArchiver.pipe).toHaveBeenCalledWith(mockMemoryStreamInstance);
      expect(mockArchiver.file).toHaveBeenCalledWith(archiveName, { name: 'reference.zip' });
      expect(mockArchiver.finalize).toHaveBeenCalled();
      expect(mockInfo).toHaveBeenCalledWith('Memory stream created');
    });
  });

  describe('function downloadScreenshots', () => {
    it('downloads the screenshots', async () => {
      const mockPipe = jest.fn();
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        body: {
          pipe: mockPipe,
        },
      });

      extract.mockResolvedValueOnce();

      const mockOnFinish = jest.fn();
      const mockWriteStream = {
        on: mockOnFinish.mockImplementationOnce((event, handler) => {
          handler();
        }),
      };
      fs.createWriteStream.mockReturnValueOnce(mockWriteStream);

      const oldCheckStatus = ScreenshotRequestor.checkStatus;
      ScreenshotRequestor.checkStatus = jest.fn();
      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      await expect(screenshotRequestor.downloadScreenshots('mock')).resolves.toBe();
      expect(fetch).toHaveBeenCalledWith(
        `${screenshotRequestor.serviceUrl}mock/reference.zip`,
        {
          method: 'GET',
          headers: {
            Authorization: screenshotRequestor.serviceAuthHeader,
          },
        },
      );
      expect(ScreenshotRequestor.checkStatus).toHaveBeenCalled();
      ScreenshotRequestor.checkStatus = oldCheckStatus;
      expect(fs.createWriteStream).toHaveBeenCalledWith('terra-wdio-screenshots.zip');
      expect(mockPipe).toHaveBeenCalledWith(mockWriteStream);
      expect(mockOnFinish).toBeCalledWith('finish', expect.any(Function));
      expect(extract).toHaveBeenCalledWith('terra-wdio-screenshots.zip', { dir: screenshotRequestor.referenceScreenshotsPath });
      expect(fs.removeSync).toHaveBeenCalledWith('terra-wdio-screenshots.zip');
      expect(mockInfo).toHaveBeenCalledWith(`Screenshots downloaded from ${screenshotRequestor.url}mock`);
    });

    it('calls out an errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      const mockThrowError = new TypeError('UNKNOWN ERROR');
      fs.createWriteStream.mockImplementationOnce(() => {
        throw mockThrowError;
      });

      const oldCheckStatus = ScreenshotRequestor.checkStatus;
      ScreenshotRequestor.checkStatus = jest.fn();
      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      await expect(screenshotRequestor.downloadScreenshots('mock')).rejects.toBe();
      expect(fetch).toHaveBeenCalledWith(
        `${screenshotRequestor.serviceUrl}mock/reference.zip`,
        {
          method: 'GET',
          headers: {
            Authorization: screenshotRequestor.serviceAuthHeader,
          },
        },
      );
      expect(ScreenshotRequestor.checkStatus).toHaveBeenCalled();
      ScreenshotRequestor.checkStatus = oldCheckStatus;
      expect(fs.createWriteStream).toHaveBeenCalledWith('terra-wdio-screenshots.zip');
      expect(fs.removeSync).toHaveBeenCalledWith('terra-wdio-screenshots.zip');
      expect(mockError).toHaveBeenCalledWith(`Error occurred while extracting screenshots. ${mockThrowError}`);
    });

    it('will return early if no screenshots exist', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 404,
      });

      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      await screenshotRequestor.downloadScreenshots('mock');
      expect(fetch).toHaveBeenCalledWith(
        `${screenshotRequestor.serviceUrl}mock/reference.zip`,
        {
          method: 'GET',
          headers: {
            Authorization: screenshotRequestor.serviceAuthHeader,
          },
        },
      );
      expect(mockInfo).toHaveBeenCalledWith(`No screenshots downloaded from ${screenshotRequestor.url}mock. Either the URL is invalid or no screenshots were previously uploaded.`);
    });

    it('will call fetch with the public url if serviceAuthHeader is undefined', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 404,
      });

      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: undefined,
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      await screenshotRequestor.downloadScreenshots('mock');
      expect(fetch).toHaveBeenCalledWith(
        `${screenshotRequestor.url}mock/reference.zip`,
        {
          method: 'GET',
        },
      );
      expect(mockInfo).toHaveBeenCalledWith(`No screenshots downloaded from ${screenshotRequestor.url}mock. Either the URL is invalid or no screenshots were previously uploaded.`);
    });
  });

  describe('uploadScreenshots', () => {
    it('uploads the screenshots', async () => {
      const oldCheckStatus = ScreenshotRequestor.checkStatus;
      ScreenshotRequestor.checkStatus = jest.fn();
      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      const memoryStream = {
        length: 1000,
      };
      await screenshotRequestor.uploadScreenshots(memoryStream, 'mock');

      expect(FormData).toHaveBeenCalled();
      const mockFormDataInstance = FormData.mock.instances[0];
      expect(mockFormDataInstance.append).toHaveBeenCalledWith('file', memoryStream, { filename: 'reference.zip', knownLength: 1000 });
      expect(fetch).toHaveBeenCalledWith(
        `${screenshotRequestor.serviceUrl}mock/`,
        {
          method: 'PUT',
          headers: {
            Authorization: screenshotRequestor.serviceAuthHeader,
          },
          body: mockFormDataInstance,
        },
      );
      expect(ScreenshotRequestor.checkStatus).toHaveBeenCalled();
      ScreenshotRequestor.checkStatus = oldCheckStatus;
      expect(mockInfo).toHaveBeenCalledWith(`Screenshots are uploaded to ${screenshotRequestor.url}mock`);
    });
  });

  describe('download', () => {
    it('calls downloadScreenshots', async () => {
      const oldDownloadScreenshots = ScreenshotRequestor.prototype.downloadScreenshots;
      const oldMakeReferenceName = ScreenshotRequestor.makeReferenceName;
      ScreenshotRequestor.prototype.downloadScreenshots = jest.fn();
      ScreenshotRequestor.makeReferenceName = jest.fn();

      const screenshotRequestor = new ScreenshotRequestor({});

      const referenceName = 'locale-theme-formFactor-browser';
      ScreenshotRequestor.makeReferenceName.mockImplementationOnce(() => referenceName);
      screenshotRequestor.downloadScreenshots.mockResolvedValueOnce();

      await screenshotRequestor.download('locale', 'theme', 'formFactor', 'browser');

      expect(ScreenshotRequestor.makeReferenceName).toHaveBeenCalledWith('locale', 'theme', 'formFactor', 'browser');
      expect(screenshotRequestor.downloadScreenshots).toHaveBeenCalledWith(referenceName);
      ScreenshotRequestor.prototype.downloadScreenshots = oldDownloadScreenshots;
      ScreenshotRequestor.makeReferenceName = oldMakeReferenceName;
    });
  });

  describe('upload', () => {
    it('deletes the existing screenshots and zips and uploads the new screenshots', async () => {
      const oldMakeReferenceName = ScreenshotRequestor.makeReferenceName;
      const oldDeleteExistingScreenshots = ScreenshotRequestor.prototype.deleteExistingScreenshots;
      const oldZipLatestScreenshots = ScreenshotRequestor.prototype.zipLatestScreenshots;
      const oldzipDirectoryToMemory = ScreenshotRequestor.prototype.zipDirectoryToMemory;
      const oldUploadScreenshots = ScreenshotRequestor.prototype.uploadScreenshots;
      const oldDeleteZippedLatestScreenshots = ScreenshotRequestor.prototype.deleteZippedLatestScreenshots;
      ScreenshotRequestor.makeReferenceName = jest.fn();
      ScreenshotRequestor.prototype.deleteExistingScreenshots = jest.fn();
      ScreenshotRequestor.prototype.zipLatestScreenshots = jest.fn();
      ScreenshotRequestor.prototype.zipDirectoryToMemory = jest.fn();
      ScreenshotRequestor.prototype.uploadScreenshots = jest.fn();
      ScreenshotRequestor.prototype.deleteZippedLatestScreenshots = jest.fn();
      const screenshotRequestor = new ScreenshotRequestor({
        latestScreenshotsPath: path.join(process.cwd(), 'latest'),
        referenceScreenshotsPath: path.join(process.cwd(), 'reference'),
        serviceUrl: 'https://nexus.com/content-compressed/blah/',
        serviceAuthHeader: 'Basic adfadf',
        url: 'https://nexus.com/blah/',
        zipFilePath: path.join(process.cwd(), 'zip-path'),
      });

      const memoryStream = {
        length: 1000,
      };
      const referenceName = 'locale-theme-formFactor-browser';
      ScreenshotRequestor.makeReferenceName.mockImplementationOnce(() => referenceName);
      screenshotRequestor.deleteExistingScreenshots.mockResolvedValueOnce();
      screenshotRequestor.zipLatestScreenshots.mockResolvedValueOnce();
      screenshotRequestor.zipDirectoryToMemory.mockResolvedValueOnce(memoryStream);
      screenshotRequestor.uploadScreenshots.mockResolvedValueOnce();
      screenshotRequestor.deleteZippedLatestScreenshots.mockResolvedValueOnce();

      await screenshotRequestor.upload('locale', 'theme', 'formFactor', 'browser');

      expect(ScreenshotRequestor.makeReferenceName).toHaveBeenCalledWith('locale', 'theme', 'formFactor', 'browser');
      expect(screenshotRequestor.deleteExistingScreenshots).toHaveBeenCalledWith(referenceName);
      expect(screenshotRequestor.zipDirectoryToMemory).toHaveBeenCalled();
      expect(screenshotRequestor.uploadScreenshots).toHaveBeenCalledWith(memoryStream, referenceName) ;
      expect(screenshotRequestor.deleteZippedLatestScreenshots).toHaveBeenCalled() ;
      ScreenshotRequestor.makeReferenceName = oldMakeReferenceName;
      ScreenshotRequestor.prototype.deleteExistingScreenshots = oldDeleteExistingScreenshots;
      ScreenshotRequestor.prototype.zipLatestScreenshots = oldZipLatestScreenshots;
      ScreenshotRequestor.prototype.zipDirectoryToMemory = oldzipDirectoryToMemory;
      ScreenshotRequestor.prototype.uploadScreenshots = oldUploadScreenshots;
      ScreenshotRequestor.prototype.deleteZippedLatestScreenshots = oldDeleteZippedLatestScreenshots;
    });
  });

  describe('makeReferenceName', () => {
    it('should return a joined string of arguments', () => {
      expect(ScreenshotRequestor.makeReferenceName('locale', 'theme', 'formFactor', 'browser')).toEqual('theme-locale-browser-formFactor');
    });

    it('should should skip undefined arguments', () => {
      expect(ScreenshotRequestor.makeReferenceName('locale', undefined, undefined, 'browser')).toEqual('locale-browser');
    });

    it('should return empty if no arguments are given', () => {
      expect(ScreenshotRequestor.makeReferenceName()).toEqual('');
    });
  });
});
