jest.mock('@cerner/terra-cli');
jest.mock('../../../../src/terra-cli/wdio/test-runner');

const command = require('../../../../src/terra-cli/wdio/index');
const TestRunner = require('../../../../src/terra-cli/wdio/test-runner');

describe('index', () => {
  it('should export the test runner cli', () => {
    expect(command).toMatchSnapshot();
  });

  it('should invoke the test runner with the default command line arguments', async () => {
    const { handler } = command;

    jest.spyOn(TestRunner, 'run').mockImplementationOnce(() => { });

    const config = {};

    await handler(config);

    expect(TestRunner.run).toHaveBeenCalledWith(config);
  });
});
