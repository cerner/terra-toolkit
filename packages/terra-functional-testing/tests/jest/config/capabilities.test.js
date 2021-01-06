const capabilities = require('../../../src/config/capabilities');

describe('capabilities', () => {
  it('should export the capabilities for each supported browser', () => {
    const { chrome, firefox, ie } = capabilities;

    expect(chrome).toBeDefined();
    expect(firefox).toBeDefined();
    expect(ie).toBeDefined();
  });
});
