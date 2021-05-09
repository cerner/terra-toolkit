const mockCreateApp = jest.fn();
const mockStart = jest.fn();
jest.mock('../../../../src/express-server', () => jest.fn().mockImplementation(() => ({
  createApp: mockCreateApp,
  start: mockStart,
})));

const expressHandler = require('../../../../src/terra-cli/express-server/expressServerHandler');
const ExpressServer = require('../../../../src/express-server');

describe('expressHandler', () => {
  it('takes in options and starts the express server', async () => {
    await expressHandler({ host: 'host', port: 'port', site: 'site' });

    expect(ExpressServer).toHaveBeenCalledWith({ host: 'host', port: 'port', site: 'site' });
    expect(mockStart).toHaveBeenCalled();
  });
});
