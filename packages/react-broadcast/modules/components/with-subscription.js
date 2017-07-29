import React from 'react';
import Subscriber from './subscriber';
import { FLAGS_CHANNEL } from './configure';

const withSubscription = propKey => WrappedComponent => {
  class Subscribed extends React.Component {
    render() {
      return (
        <Subscriber channel={FLAGS_CHANNEL}>
          {data => {
            return (
              <WrappedComponent {...{ [propKey]: data }} {...this.props} />
            );
          }}
        </Subscriber>
      );
    }
  }

  return Subscribed;
};

export default withSubscription;
