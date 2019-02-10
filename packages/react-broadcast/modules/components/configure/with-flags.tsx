import React from 'react';
import { ALL_FLAGS_PROP_KEY, wrapDisplayName } from '@flopflip/react';
import { FlagsContext } from '../flags-context';

const withFlags = <Props extends object>(
  propKey: string = ALL_FLAGS_PROP_KEY
) => (Component: React.ComponentType<Props>): React.ComponentType<Props> => {
  class EnhancedComponent extends React.PureComponent<Props> {
    static displayName = wrapDisplayName(Component, 'withFlags');

    render(): React.ReactNode {
      return (
        <FlagsContext.Consumer>
          {flags => <Component {...this.props} {...{ [propKey]: flags }} />}
        </FlagsContext.Consumer>
      );
    }
  }

  return EnhancedComponent;
};

export default withFlags;
