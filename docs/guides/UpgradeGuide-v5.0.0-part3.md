# Terra Toolkit Upgrade Guide v5.0.0 - Part 3
This document will outline the changes made to Terra's webdriver.io setup from terra-toolkit 4.x to 5.0.0. First we will outline the changes and why they were made. Then we will provide examples of common changes, as well and include stats on current vs new test execution.

## Outline of Wdio Changes
- Fixed huge viewport issue. If a viewport is not defined, it will be set to Terra's huge viewport size. This may require new screenshots for the huge viewport screenshots.
- Updated Chrome instance to use selenium 3.14-helium to test against Google Chrome: 69.0.3497.100. With this change, test are now being run against headless chrome to reach all Terra viewport widths. This results in an orange focus glow on native elements.
- AxeService functionally was moved to the Terra Service
- TerraService
  - Now provides the accessibility testing capabilities. These have been scoped to only check WCAG 2.0 AA and Section 508 accessibility standards to align with Terra's accessibility standards. 
  - Terra global:
    - removed `Terra.should` test helpers
    - added `Terra.it` test helpers. These are Mocha-chia `it` blocks  to replace `Terra.should` test helpers. 
      - Terra.it.isAccessible() 
        - This was updated to no longer accept context as a test option but instead always use `document`. Delete from passed test options. i.e. `Terra.should.beAccessible({ context })` -> `Terra.it.isAccessible()`
        - test options include:
          - rules - the axe rules to assert in the test run
          - viewports - this is not a recommended option. This can cause unintended behavior in UI and result in x page resizes for each Mocha `it` block rather than once before the test spec is ran.
      - Terra.it.matchesScreenshot()
        - test options include:
          - mismatchTolerance - percentage of mismatch acceptable before failure
          - selector - the element to take a screenshot of
          - viewports - this is not a recommended option. This can cause unintended behavior in UI and result in x page resizes for each Mocha `it` block rather than once before the test spec is ran.
      - Terra.it.validatesElement()
        - This was updated to be one it block instead of two it blocks to prevent unseen behaviors with beforeEach hooks
        - test options include:
          - axeRules - the axe rules to assert in the test run
          - mismatchTolerance - percentage of mismatch acceptable before failure
          - selector - the element to take a screenshot of
    - added `Terra.validates` test helpers. These are chia test helpers that can be used inside of `it` blocks. Terra.it test helpers use these directly, but providing these allow for one to write more cohesive test specs.
      - Terra.validates.accessibility()
      - Terra.validates.screenshot()
      - Terra.validates.element()
    - added `describeViewports`. This is a Mocha `describe` block which is intended to use used as a top-level describe block for tests to 1) simplify test writing 2) enabled writing test that support both viewport and formFactor testing for better local testing and paralyzed CI testing. Using this will eliminate the need to use `--formFactors` when using the `tt-wdio` runner to run locale & form factor test locally--which improves test times.
- There global refresh hook has been remove which previously reset the state of the page after each `it` was run. This will improve test tests, enable one to write more cohesive test specs and catch bugs with functionally that may have previously been blow away. This also means Mocha `before` and `beforeEach` hooks should be used sparingly since these be executed multiple times, where as Mocha `it` blocks are easier to follow and get executed in the order they are written. With this, use `browser.refresh()` sparingly. Each refresh will end the current selenium session and require a new session request to be made in your spec.
- Added `SITE` environmental variable to the wdio config to allow testing against pre-compile test assets. Use this when you do not want wdio to run webpack.
- wdio configuration must be provided to both `wdio` and `tt-wdio` if a `wdio.config.js` file does not exist at the root level. 

## References:
These are provided in docs throughout toolkit but here they are for quick reference:
- wdio api: http://v4.webdriver.io/api.html
- mocha test framework docs: https://mochajs.org/
- chai assertion library docs: https://www.chaijs.com/
- quick reference to mocha execution: https://gist.github.com/harto/c97d2fc9d0bfaf20706eb2acbf48c908

## What Does this Even Mean?
SO this seems a lot of changes! Where to start?! We will use the following example spec to outline the possible updates and changes that can and/or should be made with terra-toolkit v5.

### Lets Review an Example Spec
The following example is an example that hopefully highlights everything that could break or need changes for v5. Most of these changes will be simple. I promise.
details
<summary> Example Spec: <code>test-app-spec.js</code> </summary>

```js
const viewports = Terra.viewports('tiny', 'huge');
describe('Test App', () => {
  describe('form input', () => {
    before(() => {
      browser.url('/#/raw/tests/page1');
      // Removes the blinking cursor to prevent screenshot mismatches.
      browser.execute(() => {
        document.querySelector('input').style.caretColor = 'transparent';
      });
    });

    Terra.should.validateElement();

    it('enters text', () => {
      browser.keys('Tab');
      browser.addValue('input', 'stuff');
    })

    Terra.should.validateElement('with input');
  })

  describe('multi-select table', () => {
    before(() => {
      browser.url('/#/raw/tests/page1');
    });

    Terra.should.beAccessible({ viewports });
    Terra.should.matchScreenshot({ viewports });
  });

  describe('multi-select table with first item selected', () => {
    before(() => {
      browser.url('/#/raw/tests/page1');
      browser.click('#row1');
    });

    Terra.should.validateElement({ viewports });
  });

  describe('multi-select table with second item selected', () => {
    beforeEach(() => {
      browser.url('/#/raw/tests/page1');
      browser.click('#row1');
    });

    Terra.should.beAccessible({ viewports, context: '#row1' });
    Terra.should.matchScreenshot('selected', { viewports, viewportChangePause: 200 });
  });

  // loop viewports to prevent closing popups with viewport resizing
  viewports.forEach((viewport) => { 
    describe('popup', () => {
      beforeEach(() => {
        browser.url('/#/raw/tests/page1');
        browser.setViewport(viewport);
        browser.click('#popupButton');
        browser.waitForExists('#popup');
      });
      
      Terra.should.validateElement();

      describe('click popup content', () => {
        beforeEach(() => browser.click('#popupContent'));

        Terra.should.validateElement();
      });
    });
  });
});
```
</details>

### The Results
UPDATE THESE ARE NOW WRONG
Running this spec would resulted in 14 viewport resizes to complete 15 tests and take 10 screenshots, 2 which have the incorrect huge viewport size. Surprised? We were when we realized we were pushing bad test writing practices due to the global refresh.

<details>
<summary>Mocha Execution Order</summary>

```
// $ - represents Terra's global refresh which request a new selenium session
// > - represents a Mocha describe block
// ~ - represents a Mocha hook block
// ✓ - represents a Mocha it block 

> Test App

  > Test App - form input
    $ Terra's global before()
    ~ Test App - form input - before()
      ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
      ✓ enters text
      ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot

  > Test App - multi-select table
    $ Terra's global before()
    ~ Test App - multi-select table - before()
      ✓ is accessible // 2 viewport resizes
      ✓ [default] is within the mismatch tolerance // 2 viewport resizes, 2 screenshots

  > Test App - multi-select table with first item selected
    $ Terra's global before()
    ~ Test App - multi-select table with first item selected - before()
      ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot

  > Test App - multi-select table with second item selected
    $ Terra's global before()
    ~ Test App - multi-select table with second item selected - beforeEach()
      ✓ is accessible // 2 viewport resizes

    ~ Test App - multi-select table with second item selected - beforeEach()
      ✓ [default] is within the mismatch tolerance // 2 viewport resizes, 2 screenshots

  > Test App - popup
    $ Terra's global before()
    ~ Test App - popup - beforeEach()
      ✓ is accessible                              // Terra.should.validateElement

    $ Terra's global before()
    ~ Test App - popup - beforeEach()
      ✓ [default] is within the mismatch tolerance // Terra.should.validateElement, 1 screenshot
   
    > Test App - popup - click popup content
      $ Terra's global before()
      ~ Test App - popup - beforeEach()
      ~ Test App - popup - click popup content - beforeEach() hook
        ✓ is accessible                              // Terra.should.validateElement
         
    > Test App - popup - click popup content
      $ Terra's global before()
      ~ Test App - popup - beforeEach()
      ~ Test App - popup - click popup content - beforeEach() hook
        ✓ [default] is within the mismatch tolerance // Terra.should.validateElement, 1 screenshot

15 passing (40ms)
```

</details>

<details>
<summary>Generated Screenshots</summary>

```
/reference
  /en
    /chrome_tiny
      /check-spec
        /multi-select_table[default].png
        /multi-select_table_with_first_item_selected[selected].png
        /multi-select_table_with_second_item_selected[selected].png
        /popup[default].png
    /chrome_huge
      /check-spec
        /form_input[default].png     <-- non-terra huge size of 
        /form_input[with_input].png  <-- non-terra huge size of 
        /multi-select_table[default].png
        /multi-select_table_with_first_item_selected[selected].png
        /multi-select_table_with_second_item_selected[selected].png
        /popup[default].png
```
</details>

## Lets Make Changes

### Step 1. Replace `Terra.should` helpers
As mentioned above, `Terra.should` Mocha-chai test helper have been removed.


<details>
<summary><b>Why remove them?</b></summary>

It was not clear these helpers were actually Mocha `it` blocks and it affected how test could be written. How many time did you accidently write the following when learning to write wdio tests?

```js
const viewports = Terra.viewports(['tiny', 'small']);

describe('magical failure', () => {
  before(() => browser.url('#/raw/tests/open-popup'));

  Terra.should.matchScreenshot({ viewports });
  // result - the viewport resize collapsed the popup so the small screenshot is incorrect
});

describe('or different magical failure', () => {
  before(() => browser.url('#/raw/tests/popup'));

  browser.click('#triggerPopup');
  // the click is never executed because it needs to be in an Mocha it block
  // although Terra.should.matchScreenshot didn't need to be??
  browser.waitForExists('#popup');
  browser.moveToObject('#popupContent');

  Terra.should.matchScreenshot({ viewports });
  // result - the popup never opens so the screenshot is incorrect
});

describe('the resulting badly written test that works', () => {
  beforeEach(() => {
    browser.url('#/raw/tests/popup');
    browser.click('#triggerPopup');
    browser.waitForExists('#popup');
    browser.moveToObject('#popupContent');
  });
  
  Terra.should.matchScreenshot({ viewports });
  // possible result- failure in before hook, but we aren't sure which step
});

describe('well written test that is understandable ', () => {
  it('goes to test page', () => {
    browser.url('#/raw/tests/popup')
  });

  it('opens the popup', () => {
    browser.click('#triggerPopup');
    browser.waitForExists('#popup');
  });

  it('moves the mouse to prevent hover styles', () => {
    browser.moveToObject('#popupContent');
  });

  Terra.it.matchesScreenshot();
});
```
</details>

<details>
<summary> Update to use <code>Terra.it</code> helpers </summary>
Running this spec would resulted in 14 viewport resizes to complete 15 tests and take 10 screenshots, 2 which have the incorrect huge viewport size. Surprised? We were when we realized we were pushing bad test writing practices due to the global refresh.

```diff
const viewports = Terra.viewports(['tiny', 'huge']);
describe('Test App', () => {
  describe('form input', () => {
    before(() => {
      browser.url('/#/raw/tests/page1');
      // Removes the blinking cursor to prevent screenshot mismatches.
      browser.execute(() => {
        document.querySelector('input').style.caretColor = 'transparent';
      });
    });

-    Terra.should.validateElement();
+    Terra.it.validatesElement();

    it('enters text', () => {
      browser.keys('Tab');
      browser.addValue('input', 'stuff');
    })

-   Terra.should.validateElement('with input');
+   Terra.it.validatesElement('with input');
  })

  describe('multi-select table', () => {
    before(() => {
      browser.url('/#/raw/tests/page1');
    });

-   Terra.should.beAccessible({ viewports });
+   Terra.it.isAccessible({ viewports });
-   Terra.should.matchScreenshot({ viewports });
+   Terra.it.matchesScreenshot({ viewports });
  });

  describe('multi-select table with first item selected', () => {
    beforeEach(() => {
      browser.url('/#/raw/tests/page1');
      browser.click('#row1');
    });

-    Terra.should.beAccessible({ viewports, context: '#row1' });
     // context is not longer an option so remove it
+    Terra.it.isAccessible({ viewports });
-    Terra.should.matchScreenshot('selected', { viewports, selector: '#row1' });
+    Terra.it.matchesScreenshot('selected', { viewports, selector: '#row1' });
  });

  describe('multi-select table with second item selected', () => {
    beforeEach(() => {
      browser.url('/#/raw/tests/page1');
      browser.click('#row1');
    });

-   Terra.should.beAccessible({ viewports });
+   Terra.it.isAccessible({ viewports });
-   Terra.should.matchScreenshot('selected', { viewports, viewportChangePause: 200 });
    // viewportChangePause is not longer an option so remove it
+   Terra.it.matchesScreenshot('selected', { viewports });
  });

  // loop viewports to prevent closing popups with viewport resizing
  viewports.forEach((viewport) => { 
    describe('popup', () => {
      beforeEach(() => {
        browser.url('/#/raw/tests/page1');
        browser.setViewport(viewport);
        browser.click('#popupButton');
        browser.waitForExists('#popup');
      });
      
-     Terra.should.validateElement();
+      Terra.it.validatesElement();

      describe('click popup content', () => {
        beforeEach(() => browser.click('#popupContent'));

-       Terra.should.validateElement();
+       Terra.it.validatesElement();
      });
    });
  });
});
```
</details>

<details>
<summary> Update to use <code>Terra.validates</code> helpers </summary>

```diff

```
</details>