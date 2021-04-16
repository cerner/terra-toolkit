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
    jest.spyOn(glob, 'sync').mockImplementation(() => ['latest']);
    jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
    jest.spyOn(fs, 'removeSync').mockImplementationOnce(() => { });

    cleanScreenshots();

    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), 'packages');
    expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
    expect(fs.readdirSync).toHaveBeenCalledWith(mockPath);
    expect(glob.sync).toHaveBeenCalledWith(mockPath);
    expect(fs.lstatSync).toHaveBeenCalledWith(mockPath);
    expect(fs.removeSync).toHaveBeenCalledWith(mockPath);
  });

  it('should clean screenshots for non-monorepo project', () => {
    const mockPath = 'terra-toolkit/packages';
    const cwd = process.cwd();
    jest.spyOn(path, 'resolve').mockImplementation(() => mockPath);
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(glob, 'sync').mockImplementation(() => ['latest']);
    jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
    jest.spyOn(fs, 'removeSync').mockImplementation(() => { });

    cleanScreenshots();

    expect(path.resolve).toHaveBeenCalledWith(cwd, 'packages');
    expect(fs.existsSync).toHaveBeenCalledWith(mockPath);
    expect(glob.sync).toHaveBeenNthCalledWith(1, `${cwd}/tests/wdio/__snapshots__/diff`);
    expect(glob.sync).toHaveBeenNthCalledWith(2, `${cwd}/tests/wdio/__snapshots__/error`);
    expect(glob.sync).toHaveBeenNthCalledWith(3, `${cwd}/tests/wdio/__snapshots__/latest`);
    expect(fs.lstatSync).toHaveBeenNthCalledWith(1, `${cwd}/tests/wdio/__snapshots__/diff`);
    expect(fs.lstatSync).toHaveBeenNthCalledWith(2, `${cwd}/tests/wdio/__snapshots__/error`);
    expect(fs.lstatSync).toHaveBeenNthCalledWith(3, `${cwd}/tests/wdio/__snapshots__/latest`);
    expect(fs.removeSync).toHaveBeenNthCalledWith(1, `${cwd}/tests/wdio/__snapshots__/diff`);
    expect(fs.removeSync).toHaveBeenNthCalledWith(2, `${cwd}/tests/wdio/__snapshots__/error`);
    expect(fs.removeSync).toHaveBeenNthCalledWith(3, `${cwd}/tests/wdio/__snapshots__/latest`);
  });
});
