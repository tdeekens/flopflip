import type { TFlagName, TFlags } from '@flopflip/types';

import React from 'react';
import {
  wrapDisplayName,
  setDisplayName,
  DEFAULT_FLAGS_PROP_KEY,
} from '@flopflip/react';
import { useFlagVariations } from '../../hooks';

type InjectedProps = {
  [propKey: string]: TFlags;
};

export default function injectFeatureToggles<OwnProps extends object>(
  flagNames: Readonly<TFlagName[]>,
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

    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles'));

    return WrappedComponent;
  };
}
