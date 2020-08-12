const WebpackServer = require('../../../src/webpack-server');

describe('Webpack Server Index', () => {
  it('should export the webpack server', () => {
    expect(WebpackServer).toBeDefined();
  });
});
