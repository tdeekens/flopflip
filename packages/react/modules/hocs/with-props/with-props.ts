import React from 'react';

import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';

type PropsMapper<OwnProps, MappedProps> = (ownProps: OwnProps) => MappedProps;

function isPropsMapper<OwnProps, MappedProps>(
  mapProps: MappedProps | PropsMapper<OwnProps, MappedProps>
): mapProps is PropsMapper<OwnProps, MappedProps> {
  return typeof mapProps === 'function';
}

const withProps = <
  OwnProps extends object,
  MappedProps extends object,
  MapProps = MappedProps | PropsMapper<OwnProps, MappedProps>
>(
  mapProps: MapProps
) => (
  Component: React.ComponentType<any>
): React.ComponentType<OwnProps & MapProps> => {
  const EnhancedWithProps: React.FC<OwnProps & MapProps> = (
    ownProps: OwnProps
  ): React.ReactElement<OwnProps & MapProps> => {
    const enhancedProps = isPropsMapper(mapProps)
      ? { ...ownProps, ...mapProps(ownProps) }
      : { ...ownProps, ...mapProps };

    return React.createElement(Component, enhancedProps);
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Component, 'withProps'))(
      EnhancedWithProps
    );
  }

  return EnhancedWithProps;
};

export default withProps;
