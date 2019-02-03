import React from 'react';

import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';

type MapProps<P, T> = (ownProps: P) => T;
type WithProps<T> = T;

function isPropsMapper<P, T>(
  mapProps: WithProps<T> | MapProps<P, T>
): mapProps is MapProps<P, T> {
  return typeof mapProps === 'function';
}

const withProps = <P, T>(mapProps: WithProps<T> | MapProps<P, T>) => (
  BaseComponent: React.ComponentType<P & WithProps<T>>
) => {
  const EnhancedWithProps: React.FC<P> = (ownProps: P) => {
    const enhancedProps = isPropsMapper(mapProps)
      ? { ...ownProps, ...mapProps(ownProps) }
      : { ...ownProps, ...mapProps };

    return React.createElement(BaseComponent, enhancedProps);
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(
      EnhancedWithProps
    );
  }

  return EnhancedWithProps;
};

export default withProps;
