jest.mock('util');
jest.mock('fs-extra');

const { promisify } = require('util');

const mockExec = jest.fn();
promisify.mockImplementation(() => mockExec);

const setupGit = require('../../../../src/terra-cli/release/setupGit');

describe('setupGit', () => {
  it('sets up git with the appropriate credentials', async () => {
    const oldTravis = process.env.TRAVIS;
    process.env.TRAVIS = true;
    const oldGithubToken = process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = 'token';

    mockExec.mockResolvedValueOnce();
    mockExec.mockResolvedValueOnce();
    mockExec.mockResolvedValueOnce('    https://remote-url   ');
    mockExec.mockResolvedValueOnce();

    await setupGit();

    expect(mockExec).toHaveBeenCalledWith('git config --global user.email "travis@travis-ci.org"');
    expect(mockExec).toHaveBeenCalledWith('git config --global user.name "Travis CI"');
    expect(mockExec).toHaveBeenCalledWith('git config --get remote.origin.url', { encoding: 'utf8' });
    expect(mockExec).toHaveBeenCalledWith('git remote set-url origin "https://token@remote-url" > /dev/null 2>&1');

    process.env.TRAVIS = oldTravis;
    process.env.GITHUB_TOKEN = oldGithubToken;
  });
});
