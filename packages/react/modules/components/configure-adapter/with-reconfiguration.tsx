import React from 'react';
import { ReconfigureAdapter } from '@flopflip/types';
import { wrapDisplayName } from '../../hocs';
import AdapterContext from '../adapter-context';

type ProvidedProps = {
  reconfigure: ReconfigureAdapter;
};

const withReconfiguration = <OwnProps extends object>(
  propKey = 'reconfigure'
) => (
  Component: React.ComponentType<any>
): React.ComponentType<ProvidedProps & OwnProps> => {
  const WithReconfiguration = (props: OwnProps) => (
    <AdapterContext.Consumer>
      {({ reconfigure }) => (
        <Component {...props} {...{ [propKey]: reconfigure }} />
      )}
    </AdapterContext.Consumer>
  );

  WithReconfiguration.displayName = wrapDisplayName(
    Component,
    'withReconfiguration'
  );

  return WithReconfiguration;
};

export default withReconfiguration;
