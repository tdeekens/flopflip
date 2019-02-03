import { Diff } from '@flopflip/types';

import React from 'react';
import { ALL_FLAGS_PROP_KEY, wrapDisplayName } from '@flopflip/react';
import { FlagsContext } from '../flags-context';

type RequiredProps = {};
type ProvidedProps = {};

const withFlags = (propKey: string = ALL_FLAGS_PROP_KEY) => (
  Component: React.ComponentType<RequiredProps>
): React.ComponentType<any> => {
  class EnhancedComponent extends React.PureComponent<
    Diff<RequiredProps, ProvidedProps>
  > {
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
