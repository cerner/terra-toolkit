## Writing Tests

`browser.axe([{options}]);`

The following options are available:

* **viewports**:
  An array of viewports `{ width, height }` to run the accessibility test in. If none provided, by default it uses the current viewport.
* **rules**:
  The axe rules configuration to test. See [axe documentation](https://www.axe-core.org/docs/).
* **runOnly**:
  The axe tags to filter the validations to run on the accessibility to test. See [axe documentation](https://www.axe-core.org/docs/).
* **context**:
  A css selector to scope the accessibility test to. See [axe documentation](https://www.axe-core.org/docs/).

Then, the Axe Service provides the custom custom assertion `accessible()` to make validating the output of accessibility commands easier.

```js
// Use viewport helper to get { width, height } by name.
const viewports = Terra.viewports('tiny', 'huge');

it('ignores inaccessibility based on rules', () => {
  browser.url('/inaccessible-contrast.html');
  const rules = {
    'color-contrast': { enabled: false },
  };
  expect(browser.axe({ viewports, rules })).to.be.accessible();
});

it('runs only specified tags', () => {
  browser.url('/inaccessible-text.html');
  const runOnly = {
    type: 'tag',
    values: ['color-contrast'],
  };
  expect(browser.axe({ viewports, runOnly })).to.be.accessible();
});

it('runs only specified context', () => {
  browser.url('/inaccessible-contrast.html');
  let context = 'h1';
  expect(browser.axe({ viewports, context })).to.not.be.accessible();

  context = 'h2';
  expect(browser.axe({ viewports, context })).to.be.accessible();
});
```
