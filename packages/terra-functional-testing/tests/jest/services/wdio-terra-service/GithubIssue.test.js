const { Octokit } = require('@octokit/core');
const GithubIssue = require('../../../../src/services/wdio-terra-service/GithubIssue');

jest.mock('@octokit/core');
const octokitRequest = jest.fn();
Octokit.mockImplementation(() => ({
  request: octokitRequest,
}));

describe('GithubIssue', () => {
  let gi;
  const errObj = {
    status: 404,
  };
  const expectedError = new Error(JSON.stringify(errObj, null, 4));

  beforeEach(() => {
    octokitRequest.mockReset();
    gi = new GithubIssue(
      'https://example.com/github-api',
      'my-token',
      'me',
      'my-repo',
      '123',
    );
  });

  it('builds an Octokit instance correctly', () => {
    expect(Octokit).toHaveBeenCalledWith({ auth: 'my-token', baseUrl: 'https://example.com/github-api' });
  });

  it('posts a comment', async () => {
    octokitRequest.mockResolvedValue({
      status: 200,
      body: [],
    });
    await gi.postComment('hello');
    expect(octokitRequest).toHaveBeenCalledWith(
      'POST /repos/me/my-repo/issues/123/comments',
      { body: 'hello' },
    );
  });

  it('throws an error if posting fails', async () => {
    octokitRequest.mockRejectedValue(errObj);
    return expect(gi.postComment('hello')).rejects.toThrow(expectedError);
  });

  it('gets all comments', async () => {
    octokitRequest.mockResolvedValue({
      status: 200,
      data: [{ body: 'a comment' }],
    });
    const comments = await gi.getComments();
    expect(octokitRequest).toHaveBeenCalledWith('GET /repos/me/my-repo/issues/123/comments', undefined);
    expect(comments).toStrictEqual(['a comment']);
  });

  it('throws an error if getting comments fails', async () => {
    octokitRequest.mockRejectedValue(errObj);
    return expect(gi.getComments()).rejects.toThrow(expectedError);
  });
});
