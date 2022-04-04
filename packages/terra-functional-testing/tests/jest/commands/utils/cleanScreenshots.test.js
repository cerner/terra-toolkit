const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const { cleanScreenshots } = require('../../../../src/commands/utils');

jest.mock('@cerner/terra-cli/lib/utils/Logger');
jest.mock('fs-extra');
jest.mock('glob');
jest.mock('path');

describe('cleanScreenshots', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not clean directories when they dont exist', () => {
    jest.spyOn(fs, 'removeSync').mockImplementationOnce(() => { });

    cleanScreenshots();

    expect(fs.removeSync).not.toHaveBeenCalled();
  });

  it('should clean screenshots for monorepo project', () => {
    const mockPath = 'terra-toolkit/packages';
    jest.spyOn(path, 'resolve').mockImplementation(() => mockPath);
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => ['terra-functional-testing']);
    jest.spyOn(glob, 'sync').mockImplementationOnce(() => ['diff']);
    jest.spyOn(glob, 'sync').mockImplementationOnce(() => ['error']);
    jest.spyOn(glob, 'sync').mockImplementationOnce(() => ['latest']);
    jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
    jest.spyOn(fs, 'removeSync').mockImplementation(() => { });

    cleanScreenshots();

    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), 'packages');
    expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
    expect(fs.readdirSync).toHaveBeenCalledWith(mockPath);
    expect(glob.sync).toHaveBeenCalledWith(mockPath);
    expect(fs.lstatSync).toHaveBeenNthCalledWith(1, 'diff');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(2, 'error');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(3, 'latest');
    expect(fs.removeSync).toHaveBeenNthCalledWith(1, 'diff');
    expect(fs.removeSync).toHaveBeenNthCalledWith(2, 'error');
    expect(fs.removeSync).toHaveBeenNthCalledWith(3, 'latest');
  });

  it('should clean screenshots for non-monorepo project', () => {
    const mockPath = 'terra-toolkit';
    jest.spyOn(path, 'resolve').mockImplementation(() => mockPath);
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(glob, 'sync').mockImplementationOnce(() => ['diff']);
    jest.spyOn(glob, 'sync').mockImplementationOnce(() => ['error']);
    jest.spyOn(glob, 'sync').mockImplementationOnce(() => ['latest']);
    jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
    jest.spyOn(fs, 'removeSync').mockImplementation(() => { });

    cleanScreenshots();

    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), 'packages');
    expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
    expect(glob.sync).toHaveBeenCalledWith(mockPath);
    expect(fs.lstatSync).toHaveBeenNthCalledWith(1, 'diff');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(2, 'error');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(3, 'latest');
    expect(fs.removeSync).toHaveBeenNthCalledWith(1, 'diff');
    expect(fs.removeSync).toHaveBeenNthCalledWith(2, 'error');
    expect(fs.removeSync).toHaveBeenNthCalledWith(3, 'latest');
  });
});
