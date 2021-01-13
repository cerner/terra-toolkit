# Terra Enzyme Intl Upgrade Guide

## Changes from version 3 to version 4

### Project Name Updated with @cerner Scope

The project will need to be updated from terra-enzyme-intl to @cerner/terra-enzyme-intl in the devDependency list in package.json. Imports in the project will need to be updated from terra-enzyme-intl to @cerner/terra-enzyme-intl;

### Removed `shallowContext`

The project tests will need to be updated to utilize `shallowWithIntl` instead of `shallowContext`.
```diff
+ import { shallowWithIntl } from '@cerner/terra-enzyme-intl';
- import { shallow } from 'enzyme';
- import { shallowContext } from 'terra-enzyme-intl';
```

```diff
+ const shallowWrapper = shallowWithIntl(<CustomComponent />);
- const shallowWrapper = shallow(<CustomComponent />, shallowContext);
```

### Removed `mountContext`

The project tests will need to be updated to utilize `mountWithIntl` instead of `mountContext`.
```diff
+ import { mountWithIntl } from '@cerner/terra-enzyme-intl';
- import { mount } from 'enzyme';
- import { mountContext } from 'terra-enzyme-intl';
```

```diff
+ const mountWrapper = mountWithIntl(<CustomComponent />);
- const mountWrapper = mount(<CustomComponent />, shallowContext);
```

### Upgrade to react-intl v5

The project will need to be updated to utilize `react-intl` v5.