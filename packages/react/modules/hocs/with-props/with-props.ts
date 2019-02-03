import React from 'react';

import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';

type RequiredProps = {};
type MapProps<P, T> = (ownProps: P) => T;
type WithProps<T> = T;
type InjectedProps<T> = WithProps<T> & RequiredProps;

function isPropsMapper<P, T>(
  mapProps: WithProps<T> | MapProps<P, T>
): mapProps is MapProps<P, T> {
  return typeof mapProps === 'function';
}

const withProps = <P extends RequiredProps, T>(
  mapProps: WithProps<T> | MapProps<P, T>
) => (BaseComponent: React.ComponentType<P & WithProps<T>>) => {
  const WithProps = (ownProps: P): InjectedProps<T> => {
    const enhancedProps = isPropsMapper(mapProps)
      ? { ...ownProps, ...mapProps(ownProps) }
      : { ...ownProps, ...mapProps };

    return React.createElement(BaseComponent, enhancedProps);
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(
      WithProps
    );
  }

  return WithProps;
};

export default withProps;
