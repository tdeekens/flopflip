import {
  DEFAULT_FLAGS_PROP_KEY,
  setDisplayName,
  wrapDisplayName,
} from '@flopflip/react';
import { type TFlagName, type TFlags } from '@flopflip/types';
import React from 'react';

import { useFlagVariations } from '../../hooks';

type InjectedProps = Record<string, TFlags>;

export default <OwnProps extends Record<string, unknown>>(
    flagNames: TFlagName[],
    propKey: string = DEFAULT_FLAGS_PROP_KEY
  ) =>
  (
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
