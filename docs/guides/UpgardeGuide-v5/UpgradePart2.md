# Terra Toolkit Upgrade Guide v5 - Part 2
This document will outline the notable changes made to Terra's webdriver.io setup from terra-toolkit 4.x to 5.x. Full documentation on all configuration, services and test helper changes can be found on the `Changes.md` doc. First we will outline the test improvements, notable changes and why they were made. Then we will provide examples of common changes, as well and include stats on current vs new test execution.

## So, What Are the Test Improvements?

1. Ability to write tests using the correct Mocha syntax 
2. Improved test readability
3. Explicit control of the browser integration workflow being tests
4. Decreased test times 
4. Reduced the number of unnecessary test steps and viewport resizes

When uplifting terra-framework to toolkit v5, we reduced our total test time by 12 minutes! and terra-popup's test-spec was reduced by over 150 lines of code!

## What Are the Notable Changes?

1. The huge viewport issue has finally be resolved! Now if a viewport is not defined, it will be set to Terra's huge viewport size instead of the browser's previous viewport size.

2. Selenium has been updated to 3.14-helium. Previously this was 3.11-californium (or 2.53 when using the selenium grid).

3. The global before hook which preformed a browser refresh was removed. 

4. The `Terra.should` test helpers have been replaced with `Terra.it` test helpers. These are exactly the same test helpers; they've been renamed to emphasis the fact they are Mocha-chia `it` blocks.

4. The addition of the `Terra.validates` test helpers. These allow for writing more comprehensive and interactive test cases.

5. The addition of the `Terra.describeViewports`. This helper is intended to be a top-level Mocha `describe` block. You pass the describe description, the test viewports and the test callback to execute and we will manger looping the viewports for you.


## Why these changes?

It was not clear in `toolkit < v4` that the `Terra.should` tests helpers were actually Mocha `it` blocks. These caused "magical" test execution and unexpected browser behaviors and it affected how test could be written. 

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
      browser.url('/#/raw/tests/form1');
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
      browser.url('/#/raw/tests/form2');
    });

    Terra.should.beAccessible({ viewports });
    Terra.should.matchScreenshot({ viewports });
  });

  describe('multi-select table with first item selected', () => {
    before(() => {
      browser.url('/#/raw/tests/form2');
      browser.click('#row1');
    });

    Terra.should.validateElement('row 1 selected', { viewports });
  });

  describe('multi-select table with second item selected', () => {
    beforeEach(() => {
      browser.url('/#/raw/tests/form2');
      browser.click('#row2');
    });

    Terra.should.beAccessible({ viewports, context: '#row2' });
    Terra.should.matchScreenshot('row 2 selected', { viewports, viewportChangePause: 200 });
  });

  // loop viewports to prevent closing popups with viewport resizing
  viewports.forEach((viewport) => { 
    describe('popup', () => {
      beforeEach(() => {
        browser.url('/#/raw/tests/form2');
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
Running this spec would resulted in 12 viewport resizes to complete 12 tests and take 10 screenshots, 2 which have the incorrect huge viewport size. Surprised? We were when we realized we were pushing bad test writing practices due to the global refresh.

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

### Step 1. Replace `Terra.should` Mocha-chai helpers
The `Terra.should` test helpers have been removed in toolkit v5, however we have provide two new test helper options with the same functionality: `Terra.it` and `Terra.validates`.

#### Replace with `Terra.it` Mocha-chai helpers
The `Terra.it` Mocha-chai helpers will be an almost 1-to-1 replacement of the `Terra.should` test helpers. To migrate to these helpers should be simple.

These new test helpers are:

- Terra.it.isAccessible()
- Terra.it.matchesScreenshot()
- Terra.it.validatesElement()

You can start using these new helpers now and can start updating existing specs to eliminate the need to make changes in the future. 

With these:
- `Terra.it.isAccessible()` no longers supports the `context` option.
- `Terra.it.matchesScreenshot()` no longers supports the `viewportChangePause` option.

If your current code utilizes these remove options, remove them to use the default values.


#### Or use `Terra.validates` chai helpers
An alternative to the `Terra.it` Mocha-chai helpers are the `Terra.validates` chai helpers. These are test helpers intended to be used in a Mocha `it` block directly.

These new test helpers are:
- Terra.validates.accessibility()
- Terra.validates.screenshot()
- Terra.validates.element()

This enables syntax like:
```js
it('open and check screenshot', () => {
    browser.click('#openToggle');
    Terra.validates.screenshot();
});
```

### Step 2. Remove passing `viewports` to test helpers
Currently several Terra test helpers support testing multiple viewports by passing a list of viewports to test helpers. **This is no longer a recommended option**. Passing viewport results in more viewport resizes than necessary, which slows down tests and can cause bizarre behaviors in some responsive UI tests. 

For example,
```js
const viewports = Terra.viewports('tiny', 'small', 'huge');
describe('test', () => {
  before(() => browser.url('/#/raw/tests/test'));

  Terra.should.beAccessible({ viewports });
  Terra.should.matchScreenshot({ viewports });
});
```
See the problem? The viewport was resized 6 times for this small spec, when it can be optimized to only preform 3 resizes. If you have a long spec, this can have a larger impact on test time.

Thus, we have introduced the `Terra.describeViewports` Mocha `describe` helper!

#### Simplify with `Terra.describeViewports`
This helper is intended to be a top-level Mocha `describe` block. You pass the describe description, the test viewports and the test callback to execute and we will manger looping the viewports for you.

This helper:
- enables condense test code
- aligns how and when viewports resized in tests
- enable form factor testing that can be run in parallel in build systems

This enables syntax like:
```js
Terra.describeViewports('test', ['tiny', 'small', 'huge'], () => {
  before(() => browser.url('/#/raw/tests/test'));
  
  it('validates', () => {
    Terra.validates.accessibility();
    Terra.validates.screenshot();
  });
});
```

This still allows test to be runs like:
```bash
> npm run wdio
```

But then, if your project supports locale and form factor testing, you can disable the formFactor options in the tt-wdio runner to run tests faster locally (yay):
```
> npm run ot-wdio --locales ['en', 'es', 'pt'] --formFactors ['unsupported']
```


### Lets Review The Example Spec After Test Helper Updates
< details>
<summary> Updated Example Spec: <code>test-app-spec.js</code> </summary>

```diff
- const viewports = Terra.viewports('tiny', 'huge');
- describe('Test App', () => {
+ Terra.describeViewports('Test App', ['tiny', 'huge'], () => {
  describe('form input', () => {
    before(() => {
      browser.url('/#/raw/tests/form1');
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

-    Terra.should.validateElement();
+    Terra.it.validatesElement();
    Terra.it.validateElement('with input');
  })

  describe('multi-select table', () => {
    before(() => {
      browser.url('/#/raw/tests/form2');
    });

-   Terra.should.beAccessible({ viewports });
+   Terra.it.isAccessible();
-   Terra.should.matchScreenshot({ viewports });
+   Terra.it.matchesScreenshot();
  });

  describe('multi-select table with first item selected', () => {
-    before(() => {
-      browser.url('/#/raw/tests/form2');
+   it('clicks row 1', () => {
      browser.click('#row1');
    });

-   Terra.should.validateElement('row 1 selected', { viewports });
+   Terra.it.validatesElement('row 1 selected');
  });

  describe('multi-select table with second item selected', () => {
-   beforeEach(() => {
-     browser.url('/#/raw/tests/form2');
-    });

-   Terra.should.beAccessible({ viewports, context: '#row2' });
-   Terra.it.matchScreenshot('row 2 selected', { viewports, viewportChangePause: 200 });
+   it('clicks row 2', () => {
+      browser.click('#row2');
+    });
+   Terra.it.isAccessible();
+   Terra.it.matchesScreenshot('row 2 selected');
  });

  // loop viewports to prevent closing popups with viewport resizing
  viewports.forEach((viewport) => { 
    describe('popup', () => {
      beforeEach(() => {
        browser.url('/#/raw/tests/form2');
        browser.setViewport(viewport);
        browser.click('#popupButton');
        browser.waitForExists('#popup');
      });
      
-     Terra.should.validateElement();
+     Terra.it.validatesElement();

-      describe('click popup content', () => {
-       beforeEach(() => browser.click('#popupContent'));
-       Terra.should.validateElement();
-      });
+      it('click popup content', () => {
+        browser.click('#popupContent');
+        Terra.validates.element
+      });
    });
  });
});
```
</details>

## Testing References:
These are provided in docs throughout toolkit but here they are for quick reference:
- wdio api: http://v4.webdriver.io/api.html
- mocha test framework docs: https://mochajs.org/
- chai assertion library docs: https://www.chaijs.com/
- quick reference to mocha execution: https://gist.github.com/harto/c97d2fc9d0bfaf20706eb2acbf48c908