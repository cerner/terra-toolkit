const CLI = require('../../../lib/cli/test-runner-cli');
const TestRunner = require('../../../lib/test-runner/test-runner');

describe('Test Runner CLI', () => {
  it('should export the test runner cli', () => {
    expect(CLI).toBeDefined();
  });

  it('should export the test runner cli run command', () => {
    expect(CLI.run).toBeDefined();
  });

  it('should invoke the test runner with the default command line arguments', async () => {
    const { run } = CLI;

    jest.spyOn(TestRunner, 'run').mockImplementationOnce(() => { });

    await run();

    expect(TestRunner.run).toHaveBeenCalledWith({ config: undefined });
  });
});

