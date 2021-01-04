import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  shallowWithIntl,
  mountWithIntl,
  renderWithIntl,
  mockIntl,
} from '../../src';

const prettyPrintProps = props => JSON.stringify(props, undefined, 2);

const FormattedMessageSubject = props => (
  <div>
    <FormattedMessage id="TerraEnzymeIntl.helloWorld" />
    <FormattedMessage id="TerraEnzymeIntl.buttonText">
      {text => <button type="button">{text}</button>}
    </FormattedMessage>
    {prettyPrintProps(props)}
  </div>
);

const InjectIntlSubject = injectIntl(({ intl, ...props }) => (
  <div>
    {intl.formatMessage({ id: 'TerraEnzymeIntl.helloWorld' })}
    <button type="button">{intl.formatMessage({ id: 'TerraEnzymeIntl.buttonText' })}</button>
    {prettyPrintProps(props)}
  </div>
));

const WrappingComponentSubject = ({ bar, children }) => (
  <div>
    {prettyPrintProps(bar)}
    {children}
  </div>
);

WrappingComponentSubject.propTypes = {
  bar: PropTypes.string,
  children: PropTypes.node,
};

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
    const wrapper = shallowWithIntl(subject).dive();

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

  describe('with a wrapping component', () => {
    const subject = <FormattedMessageSubject foo="bar" />;
    const wrapper = mountWithIntl(subject, { wrappingComponent: WrappingComponentSubject, wrappingComponentProps: { bar: 'foo' } });

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

  describe('with a wrapping component', () => {
    const subject = <FormattedMessageSubject foo="bar" />;
    const wrapper = shallowWithIntl(subject, { wrappingComponent: WrappingComponentSubject, wrappingComponentProps: { bar: 'foo' } });

    it('should match the snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('mockIntl', () => {
  const subject = intl => intl.formatMessage({ id: 'TerraEnzymeIntl.foo' });
  const expected = 'TerraEnzymeIntl.foo';

  describe('when used in a method expecting the react-intl intl object', () => {
    it('should match the expected output', () => {
      expect(subject(mockIntl)).toEqual(expected);
    });
  });
});
