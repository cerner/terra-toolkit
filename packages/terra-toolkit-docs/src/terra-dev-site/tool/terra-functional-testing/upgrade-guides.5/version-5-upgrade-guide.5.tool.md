# Terra Functional Testing - Version 5 Upgrade Guide

The upgrade from v4 to v5 removes `@wdio/async`

## Breaking Changes

The synchronous WebdriverIO API (`@wdio/sync`) has been [deprecated](https://webdriver.io/blog/2021/07/28/sync-api-deprecation/) and is no longer supported. Therefore, terra-functional-testing is switching over to use the asynchronous webdriver API. This will also allow for Terra to utilize future versions of Webdriver and Node which do not support `@wdio/sync`. 

Support for testing `<iframe>` components via `terra-functional-testing` is now dropped. We are now utilizing WDIO's official axe-core drivers which drops support for testing iframes. All consumers of `terra-embedded-content-consumer` are encouraged to adopt custom testing strategies for the component.

## Node Fibers

If you are Node 14 and under, you will need to install `fibers` as a dependency in the root of your project if you run your application with `webpack-config-terra`. After Node 16, `fibers` will no longer be required in your project.

## Terra-specific API Changes

`@cerner/terra-functional-testing` provides wrapper functions for accessibility testing. Previously these functions were run synchronously but now need to be executed asynchronously. The following wrapper functions now need to be specified with `await` before execution:

* `Terra.validates.element()`
* `Terra.hideInputCaret()`
* `Terra.validates.screenshot()`
* `Terra.validates.accessibility()`
* `Terra.setApplicationLocale()`

## Code Example

Here is an example of how one would re-write a test to run asynchronously from sync.

### Sync:
```
Terra.describeViewports('Date Picker', ['tiny', 'small'], () => {
  describe('Disable date picker - Disable date picker in mobile view', () => {
    it('should disable the date picker', () => {
      browser.url('/raw/tests/cerner-terra-framework-docs/date-picker/date-picker-calendar-disable');
      $('#button1').click();
      expect($('#button1').isFocused()).toEqual(true);
      $('[data-terra-open-calendar-button]').click();
      Terra.validates.element('disabled date picker');
    });
  });
});
```

### Async:
```
Terra.describeViewports('Date Picker', ['tiny', 'small'], () => {
  describe('Disable date picker - Disable date picker in mobile view', () => {
    it('should disable the date picker', async () => {
      await browser.url('/raw/tests/cerner-terra-framework-docs/date-picker/date-picker-calendar-disable');
      const buttonElement = await $('#button1')
      await buttonElement.click();
      expect(await $('#button1').isFocused()).toEqual(true);
      const calendarButton = await $('[data-terra-open-calendar-button]')
      await calendarButton.click();
      await Terra.validates.element('disabled date picker');
    });
  });
});
```

## `Expect` Changes

Before this change, all operations ran synchronously, including the asynchonous execution of other framework methods. After this change, all methods from other frameworks and libraries that were meant to run asynchronously now do so instead of being overriden by `@wdio/sync` to run synchronously. 

`@cerner/terra-functional-testing` uses Jest's `expect` under the hood to validate. Consult Jest's guide on testing asynchronous code for guidance on how to handle asynchronous operations: [Testing Asynchronous Code
](https://jestjs.io/docs/asynchronous)

### Code Example
Here is an example of how to handle asynchronous code in `jest`:
```diff
- expect(() => Terra.validates.screenshot()).toThrow(errorMessage);
+ expect(async () => {
+    await Terra.validates.screenshot();
+ }).rejects.toThrow(errorMessage);
```