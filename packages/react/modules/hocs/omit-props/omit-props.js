import { createElement } from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import { setDisplayName } from '../set-display-name';
import omit from 'lodash.omit';

const omitProps = (...propsToOmit) => BaseComponent => {
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
