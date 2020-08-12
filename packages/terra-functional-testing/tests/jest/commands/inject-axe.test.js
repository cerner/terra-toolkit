const injectAxe = require('../../../src/commands/inject-axe');

describe('Inject Axe', () => {
  it('should inject axe into the document', () => {
    const mockExecute = jest.fn();

    global.browser = {
      execute: mockExecute,
    };

    injectAxe();

    expect(mockExecute).toHaveBeenCalled();
  });

  it('should inject axe into the document with the provided options', () => {
    const mockExecute = jest.fn();
    const mockRules = { rules: [{ id: 'mock-rule', enabled: true }] };

    global.browser = {
      execute: mockExecute,
    };

    injectAxe(mockRules);

    expect(mockExecute).toHaveBeenCalledWith(expect.stringContaining('axe.configure({"rules":[{"id":"mock-rule","enabled":true}]})'));
  });
});
