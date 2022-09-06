const { Octokit } = require('@octokit/core');
const createOctokit = require('../../../../src/commands/utils/createOctokit');

jest.mock('@octokit/core');

describe('createApiClient', () => {
  beforeEach(() => {
    Octokit.mockClear();
  });
  it('can create an octokit for calling github.com unauthenticated', () => {
    createOctokit();
    expect(Octokit).toHaveBeenCalledWith({});
  });

  it('can create an octokit for calling enterprise github', () => {
    createOctokit('https://github.example.com');
    expect(Octokit).toHaveBeenCalledWith({ baseUrl: 'https://github.example.com' });
  });

  it('can create an octokit that authenticates requests with a PAT', () => {
    createOctokit(null, 'my-token');
    expect(Octokit).toHaveBeenCalledWith({ auth: 'my-token' });
  });
});
