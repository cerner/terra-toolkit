jest.mock('fs-extra');
jest.mock('@npmcli/promise-spawn');

const fs = require('fs-extra');
const spawn = require('@npmcli/promise-spawn');
const path = require('path');

const { getPathsForPackages } = require('../../../src/project-structure');

describe('getPathsForPackages', () => {
  it('returns a list of paths for packages that are not ignored for a server', async () => {
    fs.pathExists.mockResolvedValueOnce(true);
    fs.pathExists.mockResolvedValueOnce(false);
    fs.readFile.mockResolvedValueOnce('packages/jest-config-terra');

    const paths = await getPathsForPackages();

    expect(paths).toEqual([
      path.join(process.cwd(), 'package.json'),
      path.join(process.cwd(), 'client', 'package.json'),
    ]);

    expect(fs.pathExists).toHaveBeenCalledTimes(2);
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'Gemfile'));
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'));
    expect(fs.readFile).not.toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'), 'utf8');

    jest.resetAllMocks();
  });

  it('returns a list of paths for packages that are not ignored for a monorepo', async () => {
    const oldCwd = process.cwd;
    process.cwd = () => '/Users/x/ecosystem/terra-toolkit/';

    fs.pathExists.mockResolvedValueOnce(false);
    fs.pathExists.mockResolvedValueOnce(true);
    spawn.mockResolvedValueOnce({
      stdout: `/Users/x/ecosystem/terra-toolkit/packages/browserslist-config-terra
/Users/x/ecosystem/terra-toolkit/packages/duplicate-package-checker-webpack-plugin
/Users/x/ecosystem/terra-toolkit/packages/eslint-config-terra
/Users/x/ecosystem/terra-toolkit/packages/jest-config-terra
/Users/x/ecosystem/terra-toolkit/packages/package-json-lint
/Users/x/ecosystem/terra-toolkit/packages/stylelint-config-terra
/Users/x/ecosystem/terra-toolkit/packages/terra-aggregate-translations
/Users/x/ecosystem/terra-toolkit/packages/terra-cli
/Users/x/ecosystem/terra-toolkit/packages/terra-enzyme-intl
/Users/x/ecosystem/terra-toolkit/packages/terra-functional-testing
/Users/x/ecosystem/terra-toolkit/packages/terra-open-source-scripts
/Users/x/ecosystem/terra-toolkit/packages/terra-toolkit-docs
/Users/x/ecosystem/terra-toolkit/packages/webpack-config-terra`,
    });
    fs.pathExists.mockResolvedValueOnce(true);
    fs.readFile.mockResolvedValueOnce('packages/jest-config-terra\npackages/terra-cli');

    const paths = await getPathsForPackages();

    expect(paths).toMatchSnapshot();

    expect(fs.pathExists).toHaveBeenCalledTimes(3);
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'Gemfile'));
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'lerna.json'));

    process.cwd = oldCwd;

    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'));
    expect(fs.readFile).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'), 'utf8');

    jest.resetAllMocks();
  });

  it('returns a list of paths for the current package', async () => {
    fs.pathExists.mockResolvedValueOnce(false);
    fs.pathExists.mockResolvedValueOnce(false);
    fs.pathExists.mockResolvedValueOnce(true);
    fs.readFile.mockResolvedValueOnce('packages/jest-config-terra');

    const paths = await getPathsForPackages();

    expect(paths).toEqual([path.join(process.cwd(), 'package.json')]);

    expect(fs.pathExists).toHaveBeenCalledTimes(3);
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'Gemfile'));
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), 'lerna.json'));
    expect(fs.pathExists).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'));
    expect(fs.readFile).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'), 'utf8');

    jest.resetAllMocks();
  });
});
