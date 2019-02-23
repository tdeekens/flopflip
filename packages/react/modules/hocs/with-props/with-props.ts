import React from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';

type PropsMapper<OwnProps, MappedProps> = (ownProps: OwnProps) => MappedProps;
type MapProps<OwnProps, MappedProps> =
  | MappedProps
  | PropsMapper<OwnProps, MappedProps>;

function isPropsMapper<OwnProps, MappedProps>(
  mapProps: MappedProps | PropsMapper<OwnProps, MappedProps>
): mapProps is PropsMapper<OwnProps, MappedProps> {
  return typeof mapProps === 'function';
}

const withProps = <OwnProps extends object, MappedProps extends object>(
  mapProps: MapProps<OwnProps, MappedProps>
) => (
  Component: React.ComponentType<any>
): React.ComponentType<OwnProps & MapProps<OwnProps, MappedProps>> => {
  const EnhancedWithProps: React.FC<
    OwnProps & MapProps<OwnProps, MappedProps>
  > = (
    ownProps: OwnProps
  ): React.ReactElement<OwnProps & MapProps<OwnProps, MappedProps>> => {
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
