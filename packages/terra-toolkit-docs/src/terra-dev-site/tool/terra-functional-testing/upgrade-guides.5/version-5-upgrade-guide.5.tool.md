# Terra Functional Testing - Version 5 Upgrade Guide

The upgrade from v4 to v5 removes `@wdio/async`

## Breaking Changes

In order to prepare for upgrading the Terra ecosystem to be compatible with Node +18, `@wdio/sync` is being removed as a dependency from `@cerner/terra-functional-testing`. As `fibers` is being deprecated from Node +16 and `@wdio/sync` is being deprecated from Node +16, this move is necessary to bring the Terra ecosystem with the latest Node version. Due to `@wdio/sync` being removed, all tests are now run asynchronously and tests will need to be re-written in order to ensure they run asynchronously. A short introduction to changing your tests to run asynchronously can be seen here: [From Sync to Async](https://webdriver.io/docs/async-migration/)

Support for testing `<iframe>` components via `terra-functional-testing` is now dropped. We are now utilizing WDIO's official axe-core drivers which drops support for testing iframes. All consumers of `terra-embedded-content-consumer` are encouraged to adopt custom testing strategies for the component.

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