import { createElement } from 'react';
import { wrapDisplayName } from '../wrap-display-name';
import omit from 'lodash.omit';

const omitProps = (...propsToOmit) => WrappedComponent => {
  const WithPropsOmitted = props =>
    createElement(WrappedComponent, omit(props, propsToOmit));

  if (process.env.NODE_ENV !== 'production') {
    return wrapDisplayName('omitProps', WrappedComponent)(WithPropsOmitted);
  }

  return WithPropsOmitted;
};

export default omitProps;
