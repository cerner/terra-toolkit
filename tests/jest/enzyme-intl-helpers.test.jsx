import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  shallowWithIntl,
  mountWithIntl,
  renderWithIntl,
  mockIntl,
} from '../../src/enzyme-intl';

const FormattedMessageSubject = props => (
  <div>
    <FormattedMessage id="TerraToolkit.helloWorld" />
    <FormattedMessage id="TerraToolkit.buttonText">
      {text => <button type="button">{text}</button>}
    </FormattedMessage>
    {JSON.stringify(props, undefined, 2)}
  </div>
);

const InjectIntlSubject = injectIntl(({ intl, ...props }) => (
  <div>
    {intl.formatMessage({ id: 'TerraToolkit.helloWorld' })}
    <button type="button">{intl.formatMessage({ id: 'TerraToolkit.buttonText' })}</button>
    {JSON.stringify(props, undefined, 2)}
  </div>
));

describe('shallowWithIntl', () => {
  describe('using FormattedMessage', () => {
    const subject = <FormattedMessageSubject foo="bar" />;
    const wrapper = shallowWithIntl(subject);

    it('should match the snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('using injectIntl', () => {
    const subject = <InjectIntlSubject foo="bar" />;
    const wrapper = shallowWithIntl(subject);

    it('should match the snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('mountWithIntl', () => {
  describe('using FormattedMessage', () => {
    const subject = <FormattedMessageSubject foo="bar" />;
    const wrapper = mountWithIntl(subject);

    it('should match the snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('using injectIntl', () => {
    const subject = <InjectIntlSubject foo="bar" />;
    const wrapper = mountWithIntl(subject);

    it('should match the snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('renderWithIntl', () => {
  describe('using FormattedMessage', () => {
    const subject = <FormattedMessageSubject foo="bar" />;
    const wrapper = renderWithIntl(subject);

    it('should match the snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('using injectIntl', () => {
    const subject = <InjectIntlSubject foo="bar" />;
    const wrapper = renderWithIntl(subject);

    it('should match the snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('mockIntl', () => {
  const subject = intl => intl.formatMessage({ id: 'TerraToolkit.foo' });
  const expected = 'TerraToolkit.foo';

  describe('when used in a method expecting the react-intl intl object', () => {
    it('should match the expected output', () => {
      expect(subject(mockIntl)).toEqual(expected);
    });
  });
});
