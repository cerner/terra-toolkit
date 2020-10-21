const { runAxe, injectAxe } = require('../../../../src/commands/axe');

describe('index', () => {
  it('should export the run axe command', () => {
    expect(runAxe).toBeDefined();
  });

  it('should export the inject axe command', () => {
    expect(injectAxe).toBeDefined();
  });
});
