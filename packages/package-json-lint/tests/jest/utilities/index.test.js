jest.mock('fs-extra');
jest.mock('glob');
jest.mock('util');
jest.mock('ignore');

const fs = require('fs-extra');
const util = require('util');
const ignore = require('ignore');
const path = require('path');

const mockGlob = jest.fn();
util.promisify.mockImplementation(() => mockGlob);

const { getPathsForPackages } = require('../../../src/utilities');

describe('getPathsForPackages', () => {
  it('returns a list of paths for packages that are not ignored', async () => {
    fs.readFile.mockResolvedValueOnce('packages/terra-cli/tests\npackages/duplicate-package-checker-webpack-plugin/tests');
    const mockAdd = jest.fn();
    ignore.mockReturnValueOnce({
      add: mockAdd,
    });
    const mockIgnores = jest.fn();
    mockAdd.mockReturnValueOnce({
      ignores: mockIgnores,
    });
    mockGlob.mockResolvedValueOnce([
      'path1',
      'path2',
      'path3',
    ]);
    mockIgnores.mockReturnValueOnce(false);
    mockIgnores.mockReturnValueOnce(true);
    mockIgnores.mockReturnValueOnce(false);

    const paths = await getPathsForPackages();

    expect(paths).toEqual([path.relative(process.cwd(), 'path1'), path.relative(process.cwd(), 'path3')]);

    expect(fs.readFile).toHaveBeenCalledWith(path.join(process.cwd(), '.packagejsonlintignore'), 'utf8');
    expect(mockAdd).toHaveBeenCalledWith('packages/terra-cli/tests\npackages/duplicate-package-checker-webpack-plugin/tests');
    expect(mockGlob).toHaveBeenCalledWith(path.join(process.cwd(), '**', 'package.json'), { ignore: [path.join('**', 'node_modules', '**')] });
    expect(mockIgnores).toHaveBeenCalledTimes(3);
    expect(mockIgnores).toHaveBeenNthCalledWith(1, path.relative(process.cwd(), 'path1'));
    expect(mockIgnores).toHaveBeenNthCalledWith(2, path.relative(process.cwd(), 'path2'));
    expect(mockIgnores).toHaveBeenNthCalledWith(3, path.relative(process.cwd(), 'path3'));

    jest.resetAllMocks();
  });
});
