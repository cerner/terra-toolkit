jest.mock('../../../../src/lint');

const yargs = require('yargs');
const lint = require('../../../../src/lint');
const PackageJsonLintCommand = require('../../../../src/terra-cli/package-json-lint');

describe('package-json-lint', () => {
  it('declares the package-json-lint terra-cli command with proper top level help', async () => {
    const parser = yargs.command(PackageJsonLintCommand).scriptName('terra').help();
    const helpOutput = await new Promise((resolve) => {
      parser.parse('--help', (err, argv, output) => {
        resolve(output);
      });
    });
    expect(helpOutput).toMatchSnapshot();
  });

  it('declares the package-json-lint terra-cli command with proper command level help', async () => {
    const parser = yargs.command(PackageJsonLintCommand).scriptName('terra').help();
    const helpOutput = await new Promise((resolve) => {
      parser.parse('package-json-lint --help', (err, argv, output) => {
        resolve(output);
      });
    });
    expect(helpOutput).toMatchSnapshot();
  });

  it('uses the appropriate handler when calling package-json-lint', async () => {
    await PackageJsonLintCommand.handler();
    expect(lint).toHaveBeenCalled();
  });
});
