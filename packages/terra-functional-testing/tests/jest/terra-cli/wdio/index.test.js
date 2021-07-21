jest.mock('@cerner/terra-cli');
jest.mock('../../../../src/terra-cli/wdio/test-runner');

const yargs = require('yargs');
const command = require('../../../../src/terra-cli/wdio/index');
const TestRunner = require('../../../../src/terra-cli/wdio/test-runner');

describe('index', () => {
  it('declares the wdio terra-cli command with proper top level help', async () => {
    const parser = yargs.command(command).scriptName('terra').help();
    const helpOutput = await new Promise((resolve) => {
      parser.parse('--help', (_err, _argv, output) => {
        resolve(output);
      });
    });
    expect(helpOutput).toMatchSnapshot();
  });

  it('declares the wdio terra-cli command with proper command level help', async () => {
    const parser = yargs.command(command).scriptName('terra').help();
    const helpOutput = await new Promise((resolve) => {
      parser.parse('wdio --help', (_err, _argv, output) => {
        resolve(output);
      });
    });
    expect(helpOutput).toMatchSnapshot();
  });

  it('should correctly parse BROWSERS env variable when there are empty spaces', async () => {
    process.env.BROWSERS = '[chrome, firefox,      ie]';
    const parser = yargs.command(command).scriptName('terra');
    const options = await new Promise((resolve) => {
      parser.parse('wdio', (_err, _argv) => {
        resolve(_argv);
      });
    });

    expect(options.browsers).toEqual(['chrome', 'firefox', 'ie']);
  });

  it('should correctly parse BROWSERS env variable when there are no empty spaces', async () => {
    process.env.BROWSERS = '[chrome,firefox,ie]';
    const parser = yargs.command(command).scriptName('terra');
    const options = await new Promise((resolve) => {
      parser.parse('wdio', (_err, _argv) => {
        resolve(_argv);
      });
    });

    expect(options.browsers).toEqual(['chrome', 'firefox', 'ie']);
  });

  it('should invoke the test runner with the default command line arguments', async () => {
    const { handler } = command;

    jest.spyOn(TestRunner, 'start').mockImplementationOnce(() => { });

    const config = {};

    await handler(config);

    expect(TestRunner.start).toHaveBeenCalledWith(config);
  });
});
