const WebpackServer = require('../../../lib/webpack-server');

describe('Webpack Server Index', () => {
  it('should export the webpack server', () => {
    expect(WebpackServer).toBeDefined();
  });
});
