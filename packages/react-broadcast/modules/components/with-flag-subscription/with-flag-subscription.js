import React from 'react';
import { wrapDisplayName } from 'recompose';
import { Subscriber } from 'react-broadcast';
import { FLAGS_CHANNEL } from '../../constants';

const withFlagSubscription = propKey => WrappedComponent => {
  class WithFlagSubscription extends React.PureComponent {
    static displayName = wrapDisplayName(
      WrappedComponent,
      'withFlagSubscription'
    );
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

  return WithFlagSubscription;
};

export default withFlagSubscription;
