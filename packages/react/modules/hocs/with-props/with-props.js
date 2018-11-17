// @flow
import React, { createElement, type ComponentType } from 'react';

import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';

type WithProps = {};
type ProvidedProps = {};
type InjectedProps = WithProps & ProvidedProps;

const withProps = (
  mapProps: WithProps | ((ownProps: ProvidedProps) => WithProps)
) => (BaseComponent: ComponentType<ProvidedProps & WithProps>) => {
  const WithProps = (ownProps: ProvidedProps): InjectedProps => {
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
