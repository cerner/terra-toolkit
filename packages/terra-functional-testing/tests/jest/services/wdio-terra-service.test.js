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

  it('should set the expect command as a global api', () => {
    const service = new TerraService();

    const mockAddCommand = jest.fn();

    global.browser = {
      addCommand: mockAddCommand,
    };

    service.before();

    expect(expect).toBeDefined();
  });

  it('should set viewport helper commands as as global apis', () => {
    const service = new TerraService();

    const mockAddCommand = jest.fn();

    global.browser = {
      addCommand: mockAddCommand,
    };

    service.before();

    expect(Terra.viewports).toBeDefined();
    expect(Terra.describeViewports).toBeDefined();
  });
});
