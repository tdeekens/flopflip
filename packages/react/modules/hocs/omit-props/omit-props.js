// @flow

import { createElement, type ComponentType } from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';
import omit from 'lodash.omit';

type ProvidedProps = {};
type OmitProps = {
  [key: string]: any,
};

const omitProps = (...propsToOmit: Array<$Keys<OmitProps>>) => (
  BaseComponent: ComponentType<ProvidedProps>
): ComponentType<$Diff<ProvidedProps, OmitProps>> => {
  const OmitProps = props =>
    createElement(BaseComponent, omit(props, propsToOmit));

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'omitProps'))(
      OmitProps
    );
  }

  return OmitProps;
};

export default omitProps;
