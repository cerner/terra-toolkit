# Terra Toolkit Upgrade Guide v5 - Part 2
This document will outline the notable changes made to Terra's webdriver.io setup from terra-toolkit 4.x to 5.x. Full documentation on all configuration, services and test helper changes can be found on the `Changes.md` doc. First we will outline the test improvements, notable changes and why they were made. Then we will provide examples of common changes, as well and include stats on current vs new test execution.

## So, What Are the Test Improvements?
These changes will:
1. enabled writing correct Mocha syntax 
2. improve test readability
3. allow for explicit control of the browser integration workflow being tests
4. improve test times 
4. decrease unnecessary test steps and viewport resizes

When uplifting terra-framework to toolkit v5, we reduced our total test time by 12 minutes! And we can still make further spec improvements!

## What Are the Notable Changes?

1. The huge viewport issue has finally be resolved! Now if a viewport is not defined, it will be set to Terra's huge viewport size instead of the browser's previous viewport size.

2. Selenium has been updated to 3.14-helium. Previously this was 3.11-californium (or 2.53 when using the selenium grid).

3. The removal of the global before hook which called `browser.refresh()`. 

4. The `Terra.should` test helpers have been replaced with `Terra.it` test helpers. These are exactly the same test helpers; they've been renamed to emphasis the fact they are Mocha-chia `it` blocks.

4. The addition of the `Terra.validates` test helpers. These allow for writing more comprehensive and interactive test cases.

5. The addition of the `Terra.describeViewports`. This helper is intended to be a top-level Mocha `describe` block. You pass the describe description, the test viewports and the test callback to execute and we will manger looping the viewports for you.


## Why these changes?

It was not clear in `toolkit <v4` that the `Terra.should` tests helpers were actually Mocha `it` blocks. These caused "magical" test execution and unexpected browser behaviors and it affected how test could be written. 

Additionally, the global refresh

Additionally, the global refresh was removed for many reasons. The `browser.refresh()` command ends the current selenium session and sends a new session request and resets the state on the page for to be made for each Mocha `it` block. This resulted in badly written tests, decreased test stability and often 'hid' buggy behavior by chopping the browser integration testing into pieces rather than testing the behavior of full integration workflow. 

<details>
<summary>How many time did you accidentally write the following in a wdio spec?</summary>

```js
const viewports = Terra.viewports(['tiny', 'small']);

describe('magical failure', () => {
  before(() => {
    browser.url('#/raw/tests/popup');
    browser.click('#triggerPopup');
  });

  Terra.should.matchScreenshot({ viewports });
  // result - the viewport resize collapsed the popup so the small screenshot is incorrect
});

describe('or different magical failure', () => {
  before(() => browser.url('#/raw/tests/popup'));

  browser.click('#triggerPopup');
  // the click is never executed because it needs to be in an Mocha it block
  // although Terra.should.matchScreenshot didn't need to be??

  Terra.should.matchScreenshot();
  // result - the popup never opens so the screenshot is incorrect
});
```
</details>

### Lets Review an Example Spec
The following example is an example that hopefully highlights everything that could break or need changes for v5. Most of these changes will be simple. I promise.

<details>
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

## Notable Wdio Changes

## What Are the Notable Changes?

1. The huge viewport issue has finally be resolved! Now if a viewport is not defined, it will be set to Terra's huge viewport size instead of the browser's previous viewport size.

2. Selenium has been updated to 3.14-helium. Previously this was 3.11-californium (or 2.53 when using the selenium grid).

Updated Chrome instance to use selenium 3.14-helium to test against Google Chrome: 69.0.3497.100. With this change, test are now being run against headless chrome to reach all Terra viewport widths. This results in an orange focus glow on native elements.

3. The removal of the global refresh hook. The was would reset the state of the page after each `it` was run which was resulting in:
1) bad test writing practices with over use of Mocha `before` and `beforeEach` which slows down tests.
2) the current selenium session being killed and new selenium session request being made for each Mocha `it` assertion.  This resulted in flaky testing against a shared selenium grid.

 This will improve test tests, enable one to write more cohesive test specs and catch bugs with functionally that may have previously been blow away. This also means  hooks should be used sparingly since these be executed multiple times, where as Mocha `it` blocks are easier to follow and get executed in the order they are written. With this, use `browser.refresh()` sparingly. Each refresh will end the current selenium session and require a new session request to be made in your spec.

4. 
3. The `Terra.should` test helpers have been replaced with `Terra.it` test helpers. These are exactly the same test helpers; they've been renamed to emphasis the fact they are Mocha-chia `it` blocks.

4. The addition of the `Terra.validates` test helpers. These allow for writing more comprehensive and interactive test cases.

5. The addition of the `Terra.describeViewports`. This helper is intended to be a top-level Mocha `describe` block. You pass the describe description, the test viewports and the test callback to execute and we will manger looping the viewports for you.


## What Does this Even Mean?
SO this seems a lot of changes! Where to start?! We will use the following example spec to outline the possible updates and changes that can and/or should be made with terra-toolkit v5.



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


## Testing References:
These are provided in docs throughout toolkit but here they are for quick reference:
- wdio api: http://v4.webdriver.io/api.html
- mocha test framework docs: https://mochajs.org/
- chai assertion library docs: https://www.chaijs.com/
- quick reference to mocha execution: https://gist.github.com/harto/c97d2fc9d0bfaf20706eb2acbf48c908