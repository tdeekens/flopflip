import React from 'react';
import { ReconfigureAdapter } from '@flopflip/types';
import { wrapDisplayName } from '../../hocs';
import AdapterContext from '../adapter-context';

type ProvidedProps = {
  reconfigure: ReconfigureAdapter;
};

const withReconfiguration = <Props extends {}>(
  propKey: string = 'reconfigure'
) => (
  Component: React.ComponentType<any>
): React.ComponentType<ProvidedProps & Props> => {
  class EnhancedComponent extends React.PureComponent<ProvidedProps & Props> {
    static displayName = wrapDisplayName(Component, 'withReconfiguration');

    render(): React.ReactNode {
      return (
        <AdapterContext.Consumer>
          {reconfigure => (
            <Component {...this.props} {...{ [propKey]: reconfigure }} />
          )}
        </AdapterContext.Consumer>
      );
    }
  }

  return EnhancedComponent;
};

export default withReconfiguration;
