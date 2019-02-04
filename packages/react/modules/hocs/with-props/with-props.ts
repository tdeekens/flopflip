import React from 'react';

import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';

type MapProps<OwnProps, InjectedProps> = (ownProps: OwnProps) => InjectedProps;
type WithProps<InjectedProps> = InjectedProps;

function isPropsMapper<OwnProps, InjectedProps>(
  mapProps: WithProps<OwnProps> | MapProps<OwnProps, InjectedProps>
): mapProps is MapProps<OwnProps, InjectedProps> {
  return typeof mapProps === 'function';
}

const withProps = <OwnProps, InjectedProps>(
  mapProps: WithProps<OwnProps> | MapProps<OwnProps, InjectedProps>
): ((
  BaseComponent: React.ComponentType<any>
) => React.ComponentType<OwnProps & WithProps<InjectedProps>>) => (
  BaseComponent: React.ComponentType<OwnProps & WithProps<InjectedProps>>
) => {
  const EnhancedWithProps: React.FC<OwnProps> = (
    ownProps: OwnProps
  ): React.ComponentType<OwnProps & WithProps<InjectedProps>> => {
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
