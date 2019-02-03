import React from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';
import omit from 'lodash.omit';

type RequiredProps = {};
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

const omitProps = <P extends RequiredProps, K>(propsToOmit: K) => (
  BaseComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, K>> => {
  const OmitProps = props =>
    React.createElement(BaseComponent, omit(props, propsToOmit));

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'omitProps'))(
      OmitProps
    );
  }

  return OmitProps;
};

export default omitProps;
