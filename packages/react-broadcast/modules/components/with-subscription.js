import React from 'react';
import { wrapDisplayName } from 'recompose';
import Subscriber from './subscriber';
import { FLAGS_CHANNEL } from './configure';

const withSubscription = propKey => WrappedComponent => {
  class Subscribed extends React.Component {
    static displayName = wrapDisplayName(WrappedComponent, 'withSubscription');
    render() {
      return (
        <Subscriber channel={FLAGS_CHANNEL}>
          {data => (
            <WrappedComponent {...{ [propKey]: data }} {...this.props} />
          )}
        </Subscriber>
      );
    }
  }

  return Subscribed;
};

export default withSubscription;
