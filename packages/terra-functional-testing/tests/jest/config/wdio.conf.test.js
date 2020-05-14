const config = require('../../../lib/config/wdio.conf.js');

describe('WDIO Config', () => {
  it('should export the default WDIO configuration', () => {
    expect(config).toBeDefined();
  });
});
