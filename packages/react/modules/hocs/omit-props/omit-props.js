import { createElement } from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import omit from 'lodash.omit';

const omitProps = (...propsToOmit) => BaseComponent => {
  const WithPropsOmitted = props =>
    createElement(BaseComponent, omit(props, propsToOmit));

  if (process.env.NODE_ENV !== 'production') {
    return wrapDisplayName('omitProps', BaseComponent)(WithPropsOmitted);
  }

  return WithPropsOmitted;
};

export default omitProps;
