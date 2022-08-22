const { Octokit } = require('octokit');
const { lookupPR, PrInfo } = require('../../../../src/commands/utils/github');

const headRef = 'remove-obsolete-snapshots';
const baseRef = 'master';
const prNumber = 1;
const githubId = 107902132;
const owner = 'cerner';
const repo = 'terra-core';
const githubHostname = 'github.example.com';

describe('PrInfo', () => {
  it('Converts API number values to strings', () => {
    const info = new PrInfo(githubId, prNumber, headRef, baseRef);
    expect(info.githubId).toEqual(String(githubId));
    expect(info.prNumber).toEqual(String(prNumber));
  });
});

jest.mock('Octokit');
const octokitRequest = jest.fn();
const mockReqResp = {
  status: 200,
  data: {
    id: githubId,
    number: prNumber,
    head: {
      ref: headRef,
    },
    base: {
      ref: baseRef,
    },
  },
};

describe('lookupPR', () => {
  beforeEach(() => {
    // The coded under test uses the request method of an instance of Octokit.
    // This simulates the real API's request() method.
    Octokit.mockImplementation(() => ({
      baseURL: 'github.example.com',
      request: octokitRequest,
    }));
  });

  it('Looks up a PR', async () => {
    octokitRequest.mockImplementation(() => (mockReqResp));
    const prInfo = await lookupPR({
      githubHostname,
      owner,
      repo,
      prNumber: String(prNumber),
    });

    // Make sure we are using the API correctly.
    expect(octokitRequest.mock.calls).toEqual(
      [['GET /repos/{owner}/{repo}/pulls/{prNumber}',
        { owner, prNumber: String(prNumber), repo }]],
    );

    // Check the output of the call.
    expect(prInfo).toEqual(new PrInfo(githubId, prNumber, headRef, baseRef));
  });

  it('Raises an error if the API returns any status other than 200', async () => {
    const response = { ...mockReqResp, status: 404 };
    octokitRequest.mockImplementation(() => response);
    expect.hasAssertions();
    try {
      await lookupPR({
        githubHostname,
        owner,
        repo,
        prNumber: String(prNumber),
      });
    } catch (e) {
      expect(e.message).toEqual('github.example.com GET /repos/cerner/terra-core/pulls/1 returned status 404');
    }
  });
});
