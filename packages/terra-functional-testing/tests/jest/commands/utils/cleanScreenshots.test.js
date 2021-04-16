const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const cleanScreenshots = require('../../../../src/commands/utils/cleanScreenshots');

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
    jest.spyOn(path, 'resolve').mockImplementation(() => 'terra-toolkit/packages');
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => ['terra-functional-testing']);
    jest.spyOn(glob, 'sync').mockImplementation(() => 'latest');
    jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
    jest.spyOn(fs, 'removeSync').mockImplementationOnce(() => { });

    cleanScreenshots();

    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), 'packages');
    expect(fs.existsSync).toHaveBeenCalledWith('terra-toolkit/packages');
    expect(fs.readdirSync).toHaveBeenCalledWith('terra-toolkit/packages');
    expect(fs.lstatSync).toHaveBeenCalledWith('latest');
    expect(fs.removeSync).toHaveBeenCalledWith('latest');
    expect(glob.sync).toHaveBeenCalledWith('terra-toolkit/packages');
  });

  it('should clean screenshots for non-monorepo project', () => {
    jest.spyOn(path, 'resolve').mockImplementation(() => 'terra-toolkit/packages');
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);
    jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => {});
    jest.spyOn(glob, 'sync').mockImplementation(() => 'latest');
    jest.spyOn(fs, 'lstatSync').mockImplementation(() => ({ isDirectory: () => true }));
    jest.spyOn(fs, 'removeSync').mockImplementationOnce(() => { });

    cleanScreenshots();

    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), 'packages');
    expect(fs.existsSync).toHaveBeenCalledWith('terra-toolkit/packages');
    expect(fs.readdirSync).not.toHaveBeenCalledWith();
    expect(glob.sync).toHaveBeenCalledWith(`${process.cwd()}/tests/wdio/__snapshots__/diff`);
    expect(fs.lstatSync).toHaveBeenCalledWith('latest');
    expect(fs.removeSync).toHaveBeenCalledWith('latest');
  });
});
