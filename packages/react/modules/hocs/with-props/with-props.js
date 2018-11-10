import React, { createElement } from 'react';
import { wrapDisplayName } from '../wrap-display-name';

const withProps = baseProps => BaseComponent => {
  const WithProps = enhancedProps =>
    createElement(BaseComponent, { ...baseProps, ...enhancedProps });

  if (process.env.NODE_ENV !== 'production') {
    return wrapDisplayName('withProps', BaseComponent)(WithProps);
  }

  return WithProps;
};

export default withProps;
