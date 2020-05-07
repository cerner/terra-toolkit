const config = require('../../../../config/wdio/wdio.conf.js');

describe('WDIO Config', () => {
  it('should export the default WDIO configuration', () => {
    expect(config).toBeDefined();
  });
});
