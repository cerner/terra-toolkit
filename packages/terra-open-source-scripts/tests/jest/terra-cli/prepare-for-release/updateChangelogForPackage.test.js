jest.mock('fs-extra');

const path = require('path');
const fs = require('fs-extra');
const updateChangelogForPackage = require('../../../../src/terra-cli/prepare-for-release/updateChangelogForPackage');

describe('updateChangelogForPackage', () => {
  const mockLocaleString = jest.fn();
  const mockDate = { toLocaleString: mockLocaleString };
  let realDate;

  beforeAll(() => {
    realDate = Date.now;
    Date.now = jest.fn(() => mockDate);
  });

  afterAll(() => {
    Date.now = realDate;
  });

  it('updates changelogs with changes by adding the date and version', async () => {
    mockLocaleString.mockReturnValueOnce('November 1, 2020');

    fs.pathExists.mockResolvedValueOnce(true);
    fs.pathExists.mockResolvedValueOnce(true);
    fs.readJSON.mockResolvedValueOnce({ version: '1.2.0' });
    fs.readFile.mockResolvedValueOnce(`## Unreleased

* Changed
  * Minor change

## 1.1.0 - (October 20, 2020)

* Changed
  * Updated webpack config terra docs.`);

    await updateChangelogForPackage('package-name');

    expect(mockLocaleString).toHaveBeenCalledWith('en-us', { month: 'long', year: 'numeric', day: 'numeric' });
    expect(fs.pathExists).toHaveBeenCalledWith(path.resolve('package-name', 'package.json'));
    expect(fs.pathExists).toHaveBeenCalledWith(path.resolve('package-name', 'CHANGELOG.md'));
    expect(fs.readJSON).toHaveBeenCalledWith(path.resolve('package-name', 'package.json'));
    expect(fs.readFile).toHaveBeenCalledWith(path.resolve('package-name', 'CHANGELOG.md'), 'utf-8');
    expect(fs.writeFile).toHaveBeenCalledWith(path.resolve('package-name', 'CHANGELOG.md'), `## Unreleased

## 1.2.0 - (November 1, 2020)

* Changed
  * Minor change

## 1.1.0 - (October 20, 2020)

* Changed
  * Updated webpack config terra docs.`, { encoding: 'utf8', flag: 'w' });
  });
});
