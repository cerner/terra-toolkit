/**
 * This spec is used for testing the global axe command.
 */

describe('Axe', () => {
  it('should successfully run axe on the page', () => {
    browser.url('https://engineering.cerner.com/terra-ui/');

    const { result } = browser.axe();

    expect(result).toBeDefined();
  });
});
