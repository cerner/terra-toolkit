const { Octokit } = require('@octokit/core');
const GithubPr = require('../../../../src/services/wdio-terra-service/GithubPr');

jest.mock('@octokit/core');
const octokitRequest = jest.fn();
Octokit.mockImplementation(() => ({
  request: octokitRequest,
}));

describe('GithubPr', () => {
  let gp;

  beforeEach(() => {
    octokitRequest.mockReset();
    gp = new GithubPr(
      'https://example.com/github-api',
      'my-token',
      'me',
      'my-repo',
      '123',
    );
  });

  it('gets the base branch ref', async () => {
    octokitRequest.mockResolvedValue({
      status: 200,
      data: {
        base: {
          ref: 'hello',
        },
      },
    });
    const ref = await gp.getBaseBranchRef();
    expect(octokitRequest).toHaveBeenCalledWith(
      'GET /repos/me/my-repo/pulls/123', undefined,
    );
    expect(ref).toBe('hello');
  });

  it('throws an error if getting the pr fails', async () => {
    const errObj = {
      status: 404,
    };
    octokitRequest.mockRejectedValue(errObj);
    const errorMsg = JSON.stringify(errObj, null, 4);
    return expect(gp.postComment('hello')).rejects.toThrow(errorMsg);
  });
});
