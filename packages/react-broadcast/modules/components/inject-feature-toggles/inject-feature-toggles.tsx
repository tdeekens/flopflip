import React from 'react';
import {
  wrapDisplayName,
  setDisplayName,
  DEFAULT_FLAGS_PROP_KEY,
} from '@flopflip/react';
import { useFlagVariations } from '../../hooks';
import { TFlagName, TFlags } from '@flopflip/types';

type InjectedProps = {
  [propKey: string]: TFlags;
};

export default function injectFeatureToggles<OwnProps extends object>(
  flagNames: TFlagName[],
  propKey: string = DEFAULT_FLAGS_PROP_KEY
) {
  return (
    Component: React.ComponentType
  ): React.ComponentType<OwnProps & InjectedProps> => {
    const WrappedComponent = (ownProps: OwnProps) => {
      const flagVariations = useFlagVariations(flagNames);
      const flags = Object.fromEntries(
        flagNames.map((flagName, indexOfFlagName) => [
          flagName,
          flagVariations[indexOfFlagName],
        ])
      );
      const props = {
        ...ownProps,
        [propKey]: flags,
      };

      return <Component {...props} />;
    };

    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggles'));

    return WrappedComponent;
  };
}
