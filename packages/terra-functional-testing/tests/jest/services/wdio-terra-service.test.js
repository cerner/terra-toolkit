const TerraService = require('../../../src/services/wdio-terra-service');

describe('WDIO Terra Service', () => {
  it('should setup the global terra validates accessibility command', () => {
    const service = new TerraService();

    service.before();

    expect(global.Terra.validates.accessibility).toBeDefined();
  });
});
