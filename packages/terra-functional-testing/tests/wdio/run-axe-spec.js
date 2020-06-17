/**
 * This spec is used for testing the global axe command.
 */

describe('Axe', () => {
  it('should successfully run axe on the page', () => {
    browser.url('https://engineering.cerner.com/terra-ui/');

    const axeResults = browser.axe();
    const axeResults2 = browser.axe();

    console.log(axeResults);
    console.log(JSON.stringify(axeResults, null, 2));

    expect(browser).toHaveTitle('Terra');
  });
});
