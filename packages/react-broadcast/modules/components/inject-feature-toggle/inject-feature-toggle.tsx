import React from 'react';
import {
  wrapDisplayName,
  setDisplayName,
  DEFAULT_FLAG_PROP_KEY,
} from '@flopflip/react';
import { useFeatureToggle } from '../../hooks';
import { FlagName, FlagVariation } from '@flopflip/types';

type InjectedProps = {
  [propKey: string]: FlagVariation;
};

export default <OwnProps extends object>(
  flagName: FlagName,
  propKey: string = DEFAULT_FLAG_PROP_KEY
) => (
  Component: React.ComponentType<any>
): React.ComponentType<OwnProps & InjectedProps> => {
  const WrappedComponent = (ownProps: OwnProps) => {
    // NOTE: By passing `null` we get the actual flag variation not a boolean.
    const flagVariation = useFeatureToggle(flagName, null);
    const props = {
      ...ownProps,
      [propKey]: flagVariation,
    };

    return <Component {...props} />;
  };

  setDisplayName(wrapDisplayName(Component, 'injectFeatureToggle'));

  return WrappedComponent;
};
