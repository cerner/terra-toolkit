# Terra Toolkit Upgrade Guide v5 - Part 2
This document will outline the notable changes made to Terra's webdriver.io setup from terra-toolkit 4.x to 5.x. Full documentation on all configuration, services and test helper changes can be found on the `Changes.md` doc. First we will outline the test improvements, notable changes and why they were made. Then we will provide examples of common changes, as well and include stats on current vs new test execution.

## So, What Are the Test Improvements?

1. Ability to write tests using the correct Mocha syntax 
2. Improved test readability
3. Explicit control of the browser integration workflow being tested
4. Decreased test times 
5. Reduced the number of unnecessary test steps and viewport resizes

When uplifting terra-framework to toolkit v5, we reduced our total test time by 12 minutes! and terra-popup's test-spec was reduced by over 150 lines of code!

## What Are the Notable Changes?

1. The huge viewport issue has finally be resolved! Now if a viewport is not defined, it will be set to Terra's huge viewport size instead of the browser's previous viewport size.

2. Selenium has been updated to 3.14-helium. Previously this was 3.11-californium (or 2.53 when using the selenium grid).

3. The global before hook which preformed a browser refresh was removed. 

4. The `Terra.should` test helpers have been replaced with `Terra.it` test helpers. These are exactly the same test helpers; they've been renamed to emphasis the fact they are Mocha-chai `it` blocks.

5. The addition of the `Terra.validates` test helpers. These allow for writing more comprehensive and interactive test cases. These must be put inside of a Mocha `it` block.

6. The addition of the `Terra.describeViewports`. This helper is intended to be a top-level Mocha `describe` block. You pass the describe description, the test viewports and the test callback to execute and we will manger looping the viewports for you.


## Why these changes?

It was not clear in `toolkit < v4` that the `Terra.should` tests helpers were actually Mocha `it` blocks. These caused "magical" test execution and unexpected browser behaviors and it affected how test could be written. 

Additionally, the global refresh was removed for many reasons. The `browser.refresh()` command ends the current selenium session and sends a new session request and resets the state on the page for to be made for each Mocha `it` block. This resulted in badly written tests, decreased test stability and often 'hid' buggy behavior by chopping the browser integration testing into pieces rather than testing the behavior of full integration workflow. 

<details>
<summary>How many times did you accidentally write the following in a wdio spec?</summary>

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

## Lets Review an Example
The following is an example that hopefully highlights everything that could break or need changes for v5. Most of these changes will be simple. I promise.

Here is a simple component that allows a user to search through a table's row to select one. There is also a button that can be clicked to display a popup with more info.
<details>
<summary> Example Component: <code>exampleComponent.jsx</code> </summary>

```js
const exampleComponent = () => (
  <div>
    <Input placeholder="Search" onChange={() => searchTableRows()} />
    <Button id="popupButton" text="More Info" onClick={() => displayMoreInfoPopup()} />
    <Table>
      <Table.Row id="row1" isSelectable />
      <Table.Row id="row2" isSelectable />
    </Table>
  </div>
);

export default exampleComponent;
```
</details>

This component needs tests in Chrome and Firefox for the tiny and huge viewports. We need to verify:
1) the input accepts text
2) table rows are selectable
3) the popup displays when the button is click

<details>
<summary>Here is the resulting test spec: <code>example-spec.js</code> </summary>

```js
const viewports = Terra.viewports('tiny', 'huge');
describe('Example', () => {
  describe('input', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
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


  // loop viewports to prevent closing popups with viewport resizing
  viewports.forEach((viewport) => { 
    describe('popup[${viewport.name}]', () => {
      beforeEach(() => {
        browser.url('/#/raw/tests/example');
        browser.setViewport(viewport);
        browser.click('#popupButton');
        browser.waitForExists('#popup');
      });
      
      Terra.should.validateElement();

      describe('click popup content', () => {
        beforeEach(() => browser.click('#popupContent'));

        Terra.should.beAccessible();
        Terra.should.matchScreenshot();
      });
    });
  });

  describe('table', () => {
    describe('table default')
      before(() => browser.url('/#/raw/tests/example'));

      Terra.should.beAccessible({ viewports });
      Terra.should.matchScreenshot({ viewports });
    });

    describe('table with first item selected', () => {
      before(() => {
        browser.url('/#/raw/tests/example');
        browser.click('#row1');
      });

      Terra.should.validateElement('row 1 selected');
    });

    describe('table with second item selected', () => {
      beforeEach(() => {
        browser.url('/#/raw/tests/example');
        browser.click('#row2');
      });

      Terra.should.beAccessible({ viewports, context: '#row2' });
      Terra.should.matchScreenshot('row 2 selected', { viewports, viewportChangePause: 200 });
    });
  });
});
```
</details>

### The Results
These are the results for running this spec in toolkit v4
- 14 viewport resizes
- 14 test assertions
- 11 screenshots (2 with the incorrect huge viewport size for each browser)
- 13 before hook executions
- 12 beforeEach hook executions

 Surprised? We were when we realized we were pushing bad test writing practices due to the global refresh.

<details>
<summary>Mocha Execution Order</summary>

```
// $ - represents Terra's global refresh which request a new selenium session
// > - represents a Mocha describe block
// ~ - represents a Mocha hook block
// ✓ - represents a Mocha it block 

> Example

  > Example - input
    $ Terra's global before()
    ~ Example - input - before()
      ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
      ✓ enters text
      ✓ [with input] is accessible & is within the mismatch tolerance // 1 screenshot

  > Example - popup[tiny]
    $ Terra's global before()
    ~ Example - popup[tiny] - beforeEach() // 1 viewport resize
      ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
   
    > Example - popup[tiny] - click popup content
      $ Terra's global before()
      ~ Example - popup[tiny] - beforeEach() // 1 viewport resize
      ~ Example - popup[tiny] - click popup content - beforeEach() hook
        ✓ is accessible 
         
    > Example - popup[tiny] - click popup content
      $ Terra's global before()
      ~ Example - popup[tiny] - beforeEach() // 1 viewport resize
      ~ Example - popup[tiny] - click popup content - beforeEach() hook
        ✓ [default] is within the mismatch tolerance // 1 screenshot

  > Example - popup[huge]
    $ Terra's global before()
    ~ Example - popup[huge] - beforeEach() // 1 viewport resize
      ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
   
    > Example - popup[huge] - click popup content
      $ Terra's global before()
      ~ Example - popup[huge] - beforeEach()  // 1 viewport resize
      ~ Example - popup[huge] - click popup content - beforeEach() hook
        ✓ is accessible 
         
    > Example - popup[huge] - click popup content
      $ Terra's global before()
      ~ Example - popup[huge] - beforeEach() // 1 viewport resize
      ~ Example - popup[huge] - click popup content - beforeEach() hook
        ✓ [default] is within the mismatch tolerance // 1 screenshot

  > Example - table
    > Example - table - table default
      $ Terra's global before()
      ~ Example - table - table default - before()
        ✓ is accessible // 2 viewport resizes
        ✓ [default] is within the mismatch tolerance // 2 viewport resizes, 2 screenshots

    > Example - table - table with first item selected
      $ Terra's global before()
      ~ Example - table - table with first item selected - before()
        ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot

    > Example - table - table with second item selected
      $ Terra's global before()
      ~ Example - table - table with second item selected - beforeEach()
        ✓ is accessible // 2 viewport resizes

      ~ Example - table - table with second item selected - beforeEach()
        ✓ [default] is within the mismatch tolerance
          // 2 viewport resizes, 2 screenshots

14 passing (50ms)
```
</details>

<details>
<summary>Generated Screenshots</summary>

```
/reference
  /en
    /chrome_tiny
      /check-spec
        /table_default[default].png
        /table_with_second_item_selected[row_2_selected].png
        /popup[default].png
        /click_popup_content[default].png
    /chrome_huge
      /check-spec
        /input[default].png     <-- non-terra huge size of 
        /input[with_input].png  <-- non-terra huge size of 
        /table_default[default].png
        /table_with_first_item_selected[row_1_selected].png
        /table_with_second_item_selected[row_2_selected].png
        /popup[default].png
        /click_popup_content[default].png
    /firefox_tiny  <-- same as chrome_tiny
    /firefox_huge  <-- same as chrome_huge
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

## Our Example With These Changes

<details>
<summary>Updated Example Spec: <code>test-app-spec.js</code> </summary>

```js
Terra.describeViewports('Example', ['tiny', 'huge'], () => {
  describe('input', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
      // Removes the blinking cursor to prevent screenshot mismatches.
      browser.execute(() => {
        document.querySelector('input').style.caretColor = 'transparent';
      });
    });

    Terra.it.validatesElement();

    it('enters text', () => {
      browser.keys('Tab');
      browser.addValue('input', 'stuff');
    })

    Terra.it.validatesElement('with input');
  })

  describe('popup', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
      browser.click('#popupButton');
      browser.waitForExists('#popup');
    });
    
    Terra.it.validatesElement();

    it('click popup content', () => {
      browser.click('#popupContent')
      Terra.validates.accessibility();
      Terra.validates.screenshot();
    });
  });

  describe('table', () => {
    before(() => browser.url('/#/raw/tests/example'));
    
    describe('table default')
      Terra.it.isAccessible();
      Terra.it.matchesScreenshot();
    });

    describe('table with first item selected', () => {
      it('clicks row 1', () => {
        browser.click('#row1');
      });

      Terra.it.validatesElement('row 1 selected');
    });

    describe('table with second item selected', () => {
      it('clicks row 2', () => {
        browser.click('#row2');
      });

      Terra.it.isAccessible();
      Terra.it.matchesScreenshot('row 2 selected');
    });
  });
});
```
</details>
<details>
<summary>Updated Example Spec (diff): <code>test-app-spec.js</code> </summary>

```diff
- const viewports = Terra.viewports('tiny', 'huge');
- describe('Example', () => {
+ Terra.describeViewports('Example', ['tiny', 'huge'], () => {
  describe('input', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
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
+    Terra.it.validatesElement('with input');
  })

- // loop viewports to prevent closing popups with viewport resizing
- viewports.forEach((viewport) => { 
-    describe('popup[${viewport.name}]', () => {
+    describe('popup', () => {
-     beforeEach(() => {
+     before(() => {
        browser.url('/#/raw/tests/example');
-       browser.setViewport(viewport);
        browser.click('#popupButton');
        browser.waitForExists('#popup');
      });
      
-     Terra.should.validateElement();
+     Terra.it.validatesElement();

-     describe('click popup content', () => {
-       beforeEach(() => browser.click('#popupContent'));
-        Terra.should.beAccessible();
-        Terra.should.matchScreenshot();
-      });
+      it('click popup content', () => {
+        browser.click('#popupContent');
+        Terra.validates.accessibility();
+        Terra.validates.screenshot('click popup content');
+      });
      });
    });

  describe('table', () => {
+   before(() => browser.url('/#/raw/tests/example'));
    describe('table default', () => {
-      before(() => browser.url('/#/raw/tests/example'));

-     Terra.should.beAccessible({ viewports });
-     Terra.should.matchScreenshot({ viewports });
+     Terra.it.isAccessible();
+     Terra.it.matchesScreenshot();
    });

    describe('table with first item selected', () => {
-     before(() => {
-       browser.url('/#/raw/tests/example');
+     it('clicks row 1', () => {
        browser.click('#row1');
      });

-     Terra.should.validateElement('row 1 selected', { viewports });
+     Terra.it.validatesElement('row 1 selected');
  });

    describe('table with second item selected', () => {
-     beforeEach(() => {
-       browser.url('/#/raw/tests/example');
-       browser.click('#row2');
-     });
+     it('clicks row 2', () => {
+       browser.click('#row2');
+     });

-     Terra.should.beAccessible({ viewports, context: '#row2' });
-     Terra.it.matchScreenshot('row 2 selected', { viewports, viewportChangePause: 200 });

+     Terra.it.isAccessible();
+     Terra.it.matchesScreenshot('row 2 selected');
    });
  });
});
```
</details>

### The Results
After updating to use these test helper, this spec would resulted in for each browser:
- 2 viewport resizes
- 24 test assertions
- 14 screenshots (all with the correct viewport sizes)
- 8 before hook executions
- 0 beforeEach hook executions

This increased recorded test count but it results in clearer error outputs when failure occurs. 

<details>
<summary>Mocha Execution Order</summary>

```
// > - represents a Mocha describe block
// ~ - represents a Mocha hook block
// ✓ - represents a Mocha it block 

> [tiny] Example
  ~ [tiny] Example - before() // 1 viewport resize

    > [tiny] Example - input
      ~ [tiny] Example - input - before()
        ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
        ✓ enters text
        ✓ [with input] is accessible & is within the mismatch tolerance // 1 screenshot

    > [tiny] Example - popup
      ~ [tiny]Example - popup - before()
        ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
        ✓ click popup content // 1 screenshot

    > [tiny] Example - table
      ~ [tiny] Example - table - before()

      > [tiny] Example - table - table default
        ✓ is accessible
        ✓ [default] is within the mismatch tolerance // 1 screenshot

      > [tiny] Example - table - table with first item selected
        ✓ clicks row 1
        ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot

      > [tiny] Example - table - table with second item selected
        ✓ clicks row 2
        ✓ is accessible
        ✓ [default] is within the mismatch tolerance // 1 screenshot

> [huge] Example
  ~ [huge] Example - before() // 1 viewport resize

    > [huge] Example - input
      ~ [huge] Example - input - before()
        ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
        ✓ enters text
        ✓ [with input] is accessible & is within the mismatch tolerance // 1 screenshot

    > [huge] Example - popup
      ~ [huge]Example - popup - before()
        ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot
        ✓ click popup content // 1 screenshot

    > [huge] Example - table
      ~ [huge] Example - table - before()

      > [huge] Example - table - table default
        ✓ is accessible
        ✓ [default] is within the mismatch tolerance // 1 screenshot

      > [huge] Example - table - table with first item selected
        ✓ clicks row 1
        ✓ [default] is accessible & is within the mismatch tolerance // 1 screenshot

      > [huge] Example - table - table with second item selected
        ✓ clicks row 2
        ✓ is accessible
        ✓ [default] is within the mismatch tolerance // 1 screenshot

24 passing (50ms)
```

</details>

<details>
<summary>Generated Screenshots</summary>

```diff
/reference
  /en
    /chrome_tiny
      /check-spec
+       /input[default].png     <-- added
+       /input[with_input].png  <-- added
        /table_default[default].png
+       /table_with_first_item_selected[row_1_selected].png <-- added
        /table_with_second_item_selected[row_2_selected].png
        /popup[default].png
-       /click_popup_content[default].png  <-- removed
+       /popup[click_popup_content].png    <-- added
    /chrome_huge
      /check-spec
+       /input[default].png     <-- updated to be terra huge size
+       /input[with_input].png  <-- updated to be terra huge size
        /table_default[default].png
        /table_with_first_item_selected[row_1_selected].png
        /table_with_second_item_selected[row_2_selected].png
        /popup[default].png
-       /click_popup_content[default].png  <-- removed
+       /popup[click_popup_content].png    <-- added
    /firefox_tiny  <-- same as chrome_tiny
    /firefox_huge  <-- same as chrome_huge
```
</details>

## Test Update Gotchas
So these test updates are all hunky dory, however there are a few things that might confuse you in your screenshots. 

### 1. Orange Focus Glow?

This is the browser focus glow color on native html element defined by Google Chrome.

###  2. Unexpected hover styles

Since there is no global refresh, the mouse hover may be present. This is fine, you can take screenshot with hover styles or you can move the mouse with the wdio [browser.moveToObject() command](http://v4.webdriver.io/api/action/moveToObject.html). Example:

```
browser.moveToObject('#root', 0, 400); // move mouse to (0,400) offset of the #root element
```

###  3. Screenshot Show Visuals from The Previous Test

Since there is no global refresh, the state on the page is continuous. This means previous test interactions will effect the next test that uses the same test url.

This will allow for better test coverage and enables one to slim down and write more coherent tests (we reduced 150 lines of code for terra-popup's spec).

You can reorganize and/or rewrite tests to capture the UI behavior expected in the screenshots.

###  4. Errors When Clicking a Table Row in Firefox

Unfortunately clicking <tr> tags is a known Firefox bug. Firefox maintainers suggested work around: Using the center <td> cell within <tr> as the click target which would be equivalent to clicking the center of the <tr> cell directly. See [geckodriver issue](https://github.com/mozilla/geckodriver/issues/1228) and/or [firefox issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1448825) for more info.

Our suggested workaround this issue by using the [`browser.leftClick()` command](http://v4.webdriver.io/api/action/leftClick.html) or using keyboard navigation to interact with a table row.

The wdio `browser.leftClick()` works because its using the button press and the W3C actions protocol API behind the scenes where as of the `browser.click()` command used the click protocol API directly.

### 5. Errors for `browser.execute()` in Firefox and IE

The `browser.execute()` command can be used, however it needs to be passed as a string, not function, to work in Firefox and IE:
```diff
// remove the blinking cursor for the screenshots
- browser.execute(() => {
- inputElement = document.getElementById('form-input-default');
- inputElement.style.caretColor = 'transparent';
- });
+ browser.execute('document.getElementById("form-input-default").style.caretColor = "transparent";');
```

### 6. Errors for `getAttribute('textContent')` for Firefox

The wdio `getAttribute('textContent')` command is not supported by Firefox. Instead use the wdio [`browser.getText()` command](http://v4.webdriver.io/api/property/getText.html) instead:
```diff
- $('#selector').getAttribute('textContent');
+ browser.getText('#selector');
```

## Uh Oh! Our Example Experienced Some Test Gotchas
If you review the updates we made to the `example-spec.js`, we actually will experience some of the gotchas described in the section above.

1. We are seeing an orange focus glow our input screenshots...
    - According to gotcha #1, this appears to be fine!

2. Our screenshots look weird...
    
    a. The input screenshots are showing table row hover, which it didn't previously.
    
      - According to gotcha #2, the state was cleaned up. We should evaluate if these are okay or if we want to clean up our spec. 
    
    b. The table screenshots show the input with text and the 'second row selected' screenshot shows row one selected as well!
       
      - According to gotcha #3, the state is no longer cleaned up so this is expected. We should evaluate if these are okay or if we want to enhance our spec to remove this. For the sake of not lengthening this example, we think this is fine!

3. Our tests are failing when running in firefox...
    - According to gotchas #4 and #5, we need to update our spec a bit.

<details>
<summary>More updates: </summary>

```js
Terra.describeViewports('Example', ['tiny', 'huge'], () => {
  describe('input', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
      // Removes the blinking cursor to prevent screenshot mismatches
      browser.execute('document.querySelector('\'input\').style.caretColor = "transparent";');
    });

    Terra.it.validatesElement();

    it('enters text', () => {
      browser.keys('Tab');
      browser.addValue('input', 'stuff');
    })

    Terra.it.validatesElement('with input');
  })

  describe('popup', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
      browser.click('#popupButton');
      browser.waitForExists('#popup');
    });
    
    Terra.it.validatesElement();

    it('click popup content', () => {
      browser.click('#popupContent')
      Terra.validates.accessibility();
      Terra.validates.screenshot();
    });
  });

  describe('table', () => {
    before(() => browser.url('/#/raw/tests/example'));
    
    describe('table default')
      Terra.it.isAccessible();
      Terra.it.matchesScreenshot();
    });

    describe('table with first item selected', () => {
      it('clicks row 1', () => {
        browser.leftClick('#row1');
      });

      Terra.it.validatesElement('row 1 selected');
    });

    describe('table with second item selected', () => {
      it('tabs and selects row 2', () => {
        browser.keys(['Tab', 'Enter']);
      });

      Terra.it.isAccessible();
      Terra.it.matchesScreenshot('row 2 selected');
    });
  });
});
```
</details>
<details>
<summary>More Updates (diff):</summary>

```diff
Terra.describeViewports('Example', ['tiny', 'huge'], () => {
  describe('input', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
      // Removes the blinking cursor to prevent screenshot mismatches.
-     browser.execute(() => {
-       document.querySelector('input').style.caretColor = 'transparent';
-     });
+     browser.execute('document.querySelector('\'input\').style.caretColor = "transparent";');
    });

    Terra.it.validatesElement();

    it('enters text', () => {
      browser.keys('Tab');
      browser.addValue('input', 'stuff');
    })

    Terra.it.validatesElement('with input');
  })

  describe('popup', () => {
    before(() => {
      browser.url('/#/raw/tests/example');
      browser.click('#popupButton');
      browser.waitForExists('#popup');
    });
    
    Terra.it.validatesElement();

    it('click popup content', () => {
      browser.click('#popupContent')
      Terra.validates.accessibility();
      Terra.validates.screenshot();
    });
  });

  describe('table', () => {
    before(() => browser.url('/#/raw/tests/example'));
    
    describe('table default')
      Terra.it.isAccessible();
      Terra.it.matchesScreenshot();
    });

    describe('table with first item selected', () => {
      it('clicks row 1', () => {
-       browser.click('#row1');
+       browser.leftClick('#row1');
      });

      Terra.it.validatesElement('row 1 selected');
    });

    describe('table with second item selected', () => {
-     it('clicks row 2', () => {
-       browser.click('#row2');
+     it('tabs and selects row 2', () => {
+       browser.keys(['Tab', 'Enter']);
      });

      Terra.it.isAccessible();
      Terra.it.matchesScreenshot('row 2 selected');
    });
  });
});
```
</details>

### Now, Lets Slim Down Our Spec
With the new test helpers, we could actually slim down this spec some more if we really wanted to. If you have interest in doing this, here is what we could now write:

<details>
<summary>The final, updated and slimmed down spec: </summary>

```js
Terra.describeViewports('Example', ['tiny', 'huge'], () => {
  describe('input', () => {
    it('validates input', () => {
      browser.url('/#/raw/tests/example');
      // Removes the blinking cursor to prevent screenshot mismatches.
      browser.execute('document.querySelector('\'input\').style.caretColor = "transparent";');
      Terra.validates.element();
    });

    it('enters text', () => {
      browser.keys('Tab');
      browser.addValue('input', 'stuff');
      Terra.validates.element('with input');
    });
  });

  describe('popup', () => {
    it('validates popup', () => {
      browser.url('/#/raw/tests/example');
      browser.click('#popupButton');
      browser.waitForExists('#popup');
      Terra.validates.element();
    });
    
    it('click popup content', () => {
      browser.click('#popupContent')
      Terra.validates.element();
    });
  });

  describe('table', () => {
    it('validates default table render')
      browser.url('/#/raw/tests/example')
      Terra.validates.element();
    });

    it('clicks row 1 to selected the first item', () => {
      browser.leftClick('#row1');
      Terra.validates.element('row 1 selected');
    });

    it('tabs and selects row 2 to selected the second item', () => {
      browser.keys(['Tab', 'Enter']);
      Terra.validates.element('row 2 selected');
    });
  });
});
```
</details>

### The Results
Then, after slimming down the spec, we end up with:
- 2 viewport resizes 
- 14 test assertions
- 14 screenshots (all with the correct viewport sizes)
- 2 before hook executions
- 0 beforeEach hook executions

If you don't remember, these were originally:
- 14 viewport resizes
- 14 test assertions
- 11 screenshots (2 with the incorrect huge viewport size for each browser)
- 13 before hook executions
- 12 beforeEach hook executions

This is WAYYYYYYYY better than the v4 results!

<details>
<summary>Mocha Execution Order</summary>

```
// > - represents a Mocha describe block
// ~ - represents a Mocha hook block
// ✓ - represents a Mocha it block 

> [tiny] Example
  ~ [tiny] Example - before() // 1 viewport resize

    > [tiny] Example - input
      ✓ validates input // 1 screenshot
      ✓ enters text // 1 screenshot

    > [tiny] Example - popup
      ✓ validates popup // 1 screenshot
      ✓ click popup content // 1 screenshot

    > [tiny] Example - table
        ✓ validates default table render // 1 screenshot
        ✓ clicks row 1 to selected the first item // 1 screenshot
        ✓ tabs and selects row 2 to selected the second item // 1 screenshot

> [huge] Example
  ~ [huge] Example - before() // 1 viewport resize

    > [huge] Example - input
      ✓ validates input // 1 screenshot
      ✓ enters text // 1 screenshot

    > [huge] Example - popup
      ✓ validates popup // 1 screenshot
      ✓ click popup content // 1 screenshot

    > [huge] Example - table
        ✓ validates default table render // 1 screenshot
        ✓ clicks row 1 to selected the first item // 1 screenshot
        ✓ tabs and selects row 2 to selected the second item // 1 screenshot

14 passing (50ms)
```

</details>

<details>
<summary>Generated Screenshots</summary>

```diff
/reference
  /en
    /chrome_tiny
      /check-spec
        /input[default].png
        /input[with_input].png
-       /table_default[default].png  <-- removed
+       /table[default].png  <-- added
-       /table_with_first_item_selected[row_1_selected].png <-- removed
+       /table[row_1_selected].png <-- added
-       /table_with_second_item_selected[row_2_selected].png <-- removed
+       /table[row_2_selected].png <-- added
        /popup[default].png
        /popup[click_popup_content].png
    /chrome_huge
      /check-spec
        /input[default].png
        /input[with_input].png
-       /table_default[default].png  <-- removed
+       /table[default].png  <-- added
-       /table_with_first_item_selected[row_1_selected].png <-- removed
+       /table[row_1_selected].png <-- added
-       /table_with_second_item_selected[row_2_selected].png <-- removed
+       /table[row_2_selected].png <-- added
        /popup[default].png
        /popup[click_popup_content].png
    /firefox_tiny  <-- same as chrome_tiny
    /firefox_huge  <-- same as chrome_huge
```
</details>

## Testing References
These are provided in docs throughout toolkit but here they are for quick reference:
- wdio api: http://v4.webdriver.io/api.html
- mocha test framework docs: https://mochajs.org/
- chai assertion library docs: https://www.chaijs.com/
- quick reference to mocha execution: https://gist.github.com/harto/c97d2fc9d0bfaf20706eb2acbf48c908