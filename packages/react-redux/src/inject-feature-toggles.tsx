import {
  DEFAULT_FLAGS_PROP_KEY,
  setDisplayName,
  wrapDisplayName,
} from '@flopflip/react';
import type { TFlagName, TFlags } from '@flopflip/types';
import React from 'react';

import { useFlagVariations } from './use-flag-variations';

type InjectedProps = Record<string, TFlags>;

const injectFeatureToggles =
  <OwnProps extends Record<string, unknown>>(
    flagNames: TFlagName[],
    propKey: string = DEFAULT_FLAGS_PROP_KEY,
  ) =>
  (
    Component: React.ComponentType,
  ): React.ComponentType<OwnProps & InjectedProps> => {
    function WrappedComponent(ownProps: OwnProps) {
      const flagVariations = useFlagVariations(flagNames);
      const flags = Object.fromEntries(
        flagNames.map((flagName, indexOfFlagName) => [
          flagName,
          flagVariations[indexOfFlagName],
        ]),
      );
      const props = {
        ...ownProps,
        [propKey]: flags,
      };

      return <Component {...props} />;
    }

    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles'));

    return WrappedComponent;
  };

export { injectFeatureToggles };
