jest.mock('fs-extra');
jest.mock('@npmcli/promise-spawn');

const fs = require('fs-extra');
const spawn = require('@npmcli/promise-spawn');
const path = require('path');

const { getPathsForPackages } = require('../../../src/utilities');

describe('getPathsForPackages', () => {
  it('returns a list of paths for packages that are not ignored for a server', async () => {
    fs.pathExists.mockResolvedValueOnce(true);
    fs.readFile.mockResolvedValueOnce('packages/jest-config-terra');

    const paths = await getPathsForPackages();

    expect(paths).toEqual([
      path.join(process.cwd(), 'package.json'),
      path.join(process.cwd(), 'client', 'package.json'),
    ]);

    expect(fs.pathExists).toHaveBeenCalledTimes(1);
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'Gemfile'));
    expect(fs.readFile).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'), 'utf8');

    jest.resetAllMocks();
  });

  it('returns a list of paths for packages that are not ignored for a monorepo', async () => {
    fs.pathExists.mockResolvedValueOnce(false);
    fs.pathExists.mockResolvedValueOnce(true);
    spawn.mockResolvedValueOnce({
      stdout: `${process.cwd()}/packages/browserslist-config-terra
${process.cwd()}/packages/duplicate-package-checker-webpack-plugin
${process.cwd()}/packages/eslint-config-terra
${process.cwd()}/packages/jest-config-terra
${process.cwd()}/packages/package-json-lint
${process.cwd()}/packages/stylelint-config-terra
${process.cwd()}/packages/terra-aggregate-translations
${process.cwd()}/packages/terra-cli
${process.cwd()}/packages/terra-enzyme-intl
${process.cwd()}/packages/terra-functional-testing
${process.cwd()}/packages/terra-open-source-scripts
${process.cwd()}/packages/terra-toolkit-docs
${process.cwd()}/packages/webpack-config-terra`,
    });
    fs.readFile.mockResolvedValueOnce('packages/jest-config-terra\npackages/terra-cli');

    const paths = await getPathsForPackages();

    expect(paths).toMatchSnapshot();

    expect(fs.pathExists).toHaveBeenCalledTimes(2);
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'Gemfile'));
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'lerna.json'));
    expect(fs.readFile).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'), 'utf8');

    jest.resetAllMocks();
  });

  it('returns a list of paths for the current package', async () => {
    fs.pathExists.mockResolvedValueOnce(false);
    fs.pathExists.mockResolvedValueOnce(false);
    fs.readFile.mockResolvedValueOnce('packages/jest-config-terra');

    const paths = await getPathsForPackages();

    expect(paths).toEqual([path.join(process.cwd(), 'package.json')]);

    expect(fs.pathExists).toHaveBeenCalledTimes(2);
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'Gemfile'));
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'lerna.json'));
    expect(fs.readFile).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'), 'utf8');

    jest.resetAllMocks();
  });
});
