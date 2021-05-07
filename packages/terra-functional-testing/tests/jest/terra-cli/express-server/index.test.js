jest.mock('../../../../src/terra-cli/express-server/expressServerHandler');

const yargs = require('yargs');
const expressHandler = require('../../../../src/terra-cli/express-server/expressServerHandler');
const ExpressServerCommand = require('../../../../src/terra-cli/express-server');

describe('express-server', () => {
  it('declares the express-server terra-cli command with proper top level help', async () => {
    const parser = yargs.command(ExpressServerCommand).scriptName('terra').help();
    const helpOutput = await new Promise((resolve) => {
      parser.parse('--help', (err, argv, output) => {
        resolve(output);
      });
    });
    expect(helpOutput).toMatchSnapshot();
  });

  it('declares the express-server terra-cli command with proper command level help', async () => {
    const parser = yargs.command(ExpressServerCommand).scriptName('terra').help();
    const helpOutput = await new Promise((resolve) => {
      parser.parse('express-server --help', (err, argv, output) => {
        resolve(output);
      });
    });
    expect(helpOutput).toMatchSnapshot();
  });

  it('uses the appropriate handler when calling express-server', async () => {
    expressHandler.mockResolvedValueOnce();
    await ExpressServerCommand.handler({ site: 'site', host: 'host', port: 8000 });
    expect(expressHandler).toHaveBeenCalledWith(expect.objectContaining({ site: 'site', host: 'host', port: 8000 }));
  });
});
