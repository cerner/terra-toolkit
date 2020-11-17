const mockCreateApp = jest.fn();
const mockStart = jest.fn();
jest.mock('../../../../src/terra-cli/express-server/ExpressServer', () => jest.fn().mockImplementation(() => ({
  createApp: mockCreateApp,
  start: mockStart,
})));

const expressHandler = require('../../../../src/terra-cli/express-server/expressServerHandler');
const ExpressServer = require('../../../../src/terra-cli/express-server/ExpressServer');

describe('expressHandler', () => {
  it('takes in options and starts the express server', async () => {
    await expressHandler({ host: 'host', port: 'port', site: 'site' });

    expect(ExpressServer).toHaveBeenCalledWith({ host: 'host', port: 'port', site: 'site' });
    expect(mockCreateApp).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });
});
