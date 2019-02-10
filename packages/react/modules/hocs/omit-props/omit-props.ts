import React from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';
import omit from 'lodash/omit';

const omitProps = <Props extends object>(propsToOmit: string | string[]) => (
  Component: React.ComponentType<any>
): React.ComponentType<Partial<Props>> => {
  const OmitProps: React.FC<Partial<Props>> = (
    props: any
  ): React.ReactElement<Partial<Props>> => {
    const withoutOmittedProps = omit<Props>(props, propsToOmit);

    return React.createElement(Component, withoutOmittedProps);
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(Component, 'omitProps'))(OmitProps);
  }

  return OmitProps;
};

export default omitProps;
