# Enzyme Intl Helpers

Enzyme helpers for fortifying tests that depend on react-intl by decoupling the need for actual translations. See: [react-intl documentation](https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl#helper-function-1)

## Usage

```jsx
import { shallowWithIntl, mountWithIntl } from 'terra-toolkit';

const shallowWrapper = shallowWithIntl(<CustomComponent />);
const mountWrapper = mountWithIntl(<CustomComponent />);

expect(shallowWrapper).toMatchSnapshot(); // OK, doesn't depend on real translations
expect(mountWrapper).toMatchSnapshot(); // OK, doesn't depend on real translations
```

### Mock Intl

For testing methods that depend on `react-intl` `intlShape`:

```js
import { mockIntl } from 'terra-toolkit';
import foo from '../foo';

const result = foo(mockIntl);
expect(result).toMatchSnapshot(); // OK, doesn't depend on real translations
```
