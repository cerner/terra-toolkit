const TerraService = require('../../../src/services/wdio-terra-service');

describe('WDIO Terra Service', () => {
  it('should add the axe command to the browser object', () => {
    const service = new TerraService();

    const mockAddCommand = jest.fn();

    global.browser = {
      addCommand: mockAddCommand,
    };

    service.before();

    expect(mockAddCommand).toHaveBeenCalledWith('axe', expect.any(Function));
  });
});
