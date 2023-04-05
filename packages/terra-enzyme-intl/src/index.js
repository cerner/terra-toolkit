/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */
import { createElement } from 'react';
import { mount, shallow, render } from 'enzyme';
import IntlWrapper from './IntlWrapper';

export const mockIntl = {
  defaultLocale: 'en',
  formatDate: () => 'mock date',
  formatMessage: ({ id }) => id,
  formatNumber: value => `${value}`,
  formatPlural: value => `${value}`,
  formatTime: value => `${value}`,
  formatRelativeTime: value => `${value}`,
};

const messageProxy = new Proxy({}, {
  get: (_, property) => property,
  getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }),
}); // eslint-disable-line compat/compat
const locale = 'en';
const defaultLocale = 'en';

export const mountWithIntl = (node, { wrappingComponent, wrappingComponentProps, ...options } = {}) => {
  const opts = {
    wrappingComponent: IntlWrapper,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages: messageProxy,
      WrappingComponent: wrappingComponent,
      wrappingComponentProps,
    },
    ...options,
  };

  return mount(node, opts);
};
export const renderWithIntl = (node, options = {}) => {
  const subject = createElement(IntlWrapper, {
    locale,
    defaultLocale,
    messages: messageProxy,
  }, node);

  return render(subject, options);
};

export const shallowWithIntl = (node, { wrappingComponent, wrappingComponentProps, ...options } = {}) => {
  const opts = {
    wrappingComponent: IntlWrapper,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages: messageProxy,
      WrappingComponent: wrappingComponent,
      wrappingComponentProps,
    },
    ...options,
  };

  return shallow(node, opts);
};

export default {
  mockIntl,
  mountWithIntl,
  shallowWithIntl,
  renderWithIntl,
};
