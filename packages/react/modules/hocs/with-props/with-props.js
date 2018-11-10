import React, { createElement } from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';

const withProps = mapProps => BaseComponent => {
  const WithProps = ownProps => {
    const enhancedProps =
      typeof mapProps === 'function'
        ? { ...ownProps, ...mapProps(ownProps) }
        : { ...ownProps, ...mapProps };

    return createElement(BaseComponent, enhancedProps);
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(
      WithProps
    );
  }

  return WithProps;
};

export default withProps;
