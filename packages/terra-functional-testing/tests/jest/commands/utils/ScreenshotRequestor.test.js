jest.mock('node-fetch');
jest.mock('archiver');
jest.mock('form-data');
jest.mock('../../../../src/commands/utils/MemoryStream');
const mockInfo = jest.fn();
jest.mock('@cerner/terra-cli/lib/utils/Logger', () => function mock() {
  return {
    info: mockInfo,
  };
});

const fetch = require('node-fetch');
const path = require('path');
const archiver = require('archiver');
const FormData = require('form-data');
const MemoryStream = require('../../../../src/commands/utils/MemoryStream');
const ScreenshotRequestor = require('../../../../src/commands/utils/ScreenshotRequestor');

describe('ScreenshotRequestor', () => {
  const oldCwd = process.cwd;
  beforeEach(() => {
    mockInfo.mockClear();
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

      await screenshotRequestor.deleteExistingScreenshots();

      expect(fetch).toHaveBeenCalledWith(
        screenshotRequestor.serviceUrl,
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
      await screenshotRequestor.uploadScreenshots(memoryStream);

      expect(FormData).toHaveBeenCalled();
      const mockFormDataInstance = FormData.mock.instances[0];
      expect(mockFormDataInstance.append).toHaveBeenCalledWith('file', memoryStream, { filename: 'reference.zip', knownLength: 1000 });
      expect(fetch).toHaveBeenCalledWith(
        screenshotRequestor.serviceUrl,
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
      expect(mockInfo).toHaveBeenCalledWith(`Screenshots are uploaded to ${screenshotRequestor.url}`);
    });
  });

  describe('download', () => {
    it('calls downloadScreenshots', async () => {
      const oldDownloadScreenshots = ScreenshotRequestor.prototype.downloadScreenshots;
      ScreenshotRequestor.prototype.downloadScreenshots = jest.fn();

      const screenshotRequestor = new ScreenshotRequestor({});

      screenshotRequestor.downloadScreenshots.mockResolvedValueOnce();

      await screenshotRequestor.download();

      expect(screenshotRequestor.downloadScreenshots).toHaveBeenCalled();
      ScreenshotRequestor.prototype.downloadScreenshots = oldDownloadScreenshots;
    });
  });

  describe('upload', () => {
    it('deletes the existing screenshots and zips and uploads the new screenshots', async () => {
      const oldDeleteExistingScreenshots = ScreenshotRequestor.prototype.deleteExistingScreenshots;
      const oldZipLatestScreenshots = ScreenshotRequestor.prototype.zipLatestScreenshots;
      const oldzipDirectoryToMemory = ScreenshotRequestor.prototype.zipDirectoryToMemory;
      const oldUploadScreenshots = ScreenshotRequestor.prototype.uploadScreenshots;
      const oldDeleteZippedLatestScreenshots = ScreenshotRequestor.prototype.deleteZippedLatestScreenshots;
      ScreenshotRequestor.checkStatus = jest.fn();
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
      screenshotRequestor.deleteExistingScreenshots.mockResolvedValueOnce();
      screenshotRequestor.zipLatestScreenshots.mockResolvedValueOnce();
      screenshotRequestor.zipDirectoryToMemory.mockResolvedValueOnce(memoryStream);
      screenshotRequestor.uploadScreenshots.mockResolvedValueOnce();
      screenshotRequestor.deleteZippedLatestScreenshots.mockResolvedValueOnce();

      await screenshotRequestor.upload();

      expect(screenshotRequestor.deleteExistingScreenshots).toHaveBeenCalled();
      expect(screenshotRequestor.zipDirectoryToMemory).toHaveBeenCalled();
      expect(screenshotRequestor.uploadScreenshots).toHaveBeenCalledWith(memoryStream);
      ScreenshotRequestor.prototype.deleteExistingScreenshots = oldDeleteExistingScreenshots;
      ScreenshotRequestor.prototype.zipLatestScreenshots = oldZipLatestScreenshots;
      ScreenshotRequestor.prototype.zipDirectoryToMemory = oldzipDirectoryToMemory;
      ScreenshotRequestor.prototype.uploadScreenshots = oldUploadScreenshots;
      ScreenshotRequestor.prototype.deleteZippedLatestScreenshots = oldDeleteZippedLatestScreenshots;
    });
  });
});
