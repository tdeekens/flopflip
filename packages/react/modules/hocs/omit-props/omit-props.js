import { createElement } from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';
import omit from 'just-omit';

const omitProps = (...propsToOmit) => WrappedComponent => {
  const WithPropsOmitted = props =>
    createElement(WrappedComponent, omit(props, propsToOmit));

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(WrappedComponent, 'omitProps'))(
      WithPropsOmitted
    );
  }

  return WithPropsOmitted;
};

export default omitProps;
