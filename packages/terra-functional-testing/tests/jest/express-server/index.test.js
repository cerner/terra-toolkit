const ExpressServer = require('../../../lib/express-server');

describe('Express Server Index', () => {
  it('should export the express server', () => {
    expect(ExpressServer).toBeDefined();
  });
});
