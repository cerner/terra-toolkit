import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

const propTypes = {
  /**
   * Current locale.
   */
  locale: PropTypes.string,
  /**
   * Locale to default to.
   */
  defaultLocale: PropTypes.string,
  /**
   * Object containing localize messages with keys.
   */
  messages: PropTypes.shape({}),
  /**
   * Component to be wrapped around intlProvider.
   */
  WrappingComponent: PropTypes.elementType,
  /**
   * Object containing props to be passed down to wrapping component.
   */
  wrappingComponentProps: PropTypes.shape({}),
};

const IntlWrapper = ({
  locale,
  defaultLocale,
  messages,
  children,
  WrappingComponent,
  wrappingComponentProps,
}) => {
  const intlProvider = (
    <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
      {children}
    </IntlProvider>
  );

  if (WrappingComponent) {
    return (
      <WrappingComponent {...wrappingComponentProps}>
        {intlProvider}
      </WrappingComponent>
    );
  }
  return intlProvider;
};

IntlWrapper.propTypes = propTypes;
export default IntlWrapper;
