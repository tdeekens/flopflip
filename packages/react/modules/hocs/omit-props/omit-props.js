import { createElement } from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';
import omit from 'just-omit';

const omitProps = (...propsToOmit) => WrappedComponent => {
  const OmitProps = props =>
    createElement(WrappedComponent, omit(props, propsToOmit));

  return setDisplayName(wrapDisplayName(WrappedComponent, 'omitProps'))(
    WrappedComponent
  );
};

export default omitProps;
