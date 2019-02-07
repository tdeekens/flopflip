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
  OwnProps,
  MappedProps,
  MapProps = MappedProps | PropsMapper<OwnProps, MappedProps>
>(
  mapProps: MapProps
): ((
  BaseComponent: React.ComponentType<any>
) => React.ComponentType<OwnProps & MapProps>) => BaseComponent => {
  const EnhancedWithProps: React.FC<OwnProps & MapProps> = (
    ownProps: OwnProps
  ): React.ReactElement<OwnProps & MapProps> => {
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
