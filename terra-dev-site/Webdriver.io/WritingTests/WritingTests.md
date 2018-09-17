## Writing Tests

There are a few things to note about the webdriver.io configuration provided by Terra-Toolkit:

- Test files should use `*-spec.js` naming format. The default spec search paths are `./tests/wdio/**/*-spec.js` and `./packages/*/tests/wdio/**/*-spec.js`.
- Use `/test_url_path` to direct test urls. This is appended to the `baseUrl` provided in the config.

Then, to assist with testing, the TerraService provides the Terra global helper to make testing easier:

- `Terra.viewports(name)` takes the viewport key name(s) and returns an array of { height, width } objects representing the respective terra viewport size(s).
    - Use this function to resize the browser or pass the viewport sizes to the accessibility and visual regression commands.
    - By default returns all viewports if not name key are provided.
- `Terra.should.beAccessible()` mocha-chai convenience method that runs an axe test for the page. Takes the same arguments as the `axe()` utility.
    - See [beAccessible-spec.js](https://github.com/cerner/terra-toolkit/blob/master/tests/wdio/beAccessible-spec.js) for examples.
- `Terra.should.matchScreenshot()` mocha-chai convenience method that takes a screenshot for the specified viewports and verifies the images are within the specified mis-match tolerance. Note: this method provides its own mocha it test case. The methods accepts these arguments (in this order):
    - String (optional): the test case name. Default name is 'default'
    - Object (optional): the test options. Options include selector, viewports, misMatchTolerance and viewportChangePause:
         - selector: the element selector to take a screenshot of. Defaults to the global terra.selector.
         - viewports: the array of viewports dimensions to take a screenshot in. Defaults to the current viewport size.
         - misMatchTolerance: number between 0 and 100 that defines the degree of mismatch to consider two images as identical, increasing this value will decrease test coverage. Defaults to the global visualRegression.compare.misMatchTolerance.
         - viewportChangePause: the number of milliseconds to wait after a viewport change. Defaults to the global visualRegression.viewportChangePause.
    - See [matchScreenshot-spec.js](https://github.com/cerner/terra-toolkit/blob/master/tests/wdio/matchScreenshot-spec.js) for example usage.
- `Terra.should.themeEachCustomProperty()` mocha-chai convenience method that runs a visual comparison test for each custom property given. Note: this method provides its own mocha it test case. The methods accepts these arguments (in this order):
    - String (optional): the element selector to take a screenshot of. Defaults to the global terra.selector.
    - Object: list of themeable-variable key-value pairs such that the key is the themeable-variable name and the value is the css value to check in the screenshot.
  - `Terra.should.themeCombinationOfCustomProperties()` mocha-chai convenience method that runs a visual comparison test for a grouping of custom properties provided. Note: this method provides its own mocha it test case. The methods accepts these arguments (in this order):
      - Object: the test options. Options include testName, selector and properties:
           - testName (required): the name associated to the test. Used to create unique screenshots.
           - properties (required): object of themeable-variable key-value pairs such that the key is the themeable-variable name and the value is the css value to check in the screenshot.
           - selector (optional): the element selector to take a screenshot of. Defaults to the global terra.selector.

```js
// These globals are provide via the Terra Service
/* global browser, describe, it, expect, viewport */

describe('Basic Test', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/test.html'));

  Terra.should.beAccessible({ viewports });
  Terra.should.matchScreenshot({ viewports });
  Terra.should.themeEachCustomProperty({
    '--color': 'red',
    '--font-size': '20px',
  });

  it('custom test', () => {
    expect('something').to.equal('something');
  });
});
```


If more control is needed over the assertions, the TerraService also provides the custom chai assertions `accessible` and `matchReference`:

- `accessible()` validates the `axe()` accessibility assertions on the specified viewports are successful.
- `matchReference()` validates the `checkElement` visual regression assertions on the specified viewports are either within the mis-match tolerance or are an exact match. This method accepts a string argument of `withinTolerance` or `exactly` to specify the matchType. By default the matchType is `withinTolerance`.

```js
// These globals are provide via the Terra Service
/* global browser, describe, it, expect, viewport */


describe('Advanced Test', () => {
  // Only test tiny and huge viewports
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/test.html'));

  it('checks accessibility', () => {
    expect(browser.axe()).to.be.accessible();
  });

  it('checks visual comparison', () => {
    const screenshots = browser.checkViewport({ viewports });
    expect(screenshots).to.matchReference();
  });

  it('switches viewport sizes', () => {
    viewports.forEach(size, () => {
      browser.setViewportSize(size);
    });
  });
});
```

### Testing multiple viewports.
Sometimes its necessary to rerun the test steps in each viewport. To do this, `Terra.viewports` can be used to wrap the `describe` block. Example:

```js
Terra.viewports('tiny', 'small', 'large').forEach((viewport) => {
  describe('Resize Example', () => {
    before(() => {
      browser.setViewportSize(viewport);
      browser.url('/test.html');
    });

    it(`resizes ${viewport.name}`, () => {
      const size = browser.getViewportSize();
      expect(size.height).to.equal(viewport.height);
      expect(size.width).to.equal(viewport.width);
    });
  });
});
```

This will generate a describe block for each viewport.
