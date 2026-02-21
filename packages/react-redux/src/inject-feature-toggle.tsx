import {
  DEFAULT_FLAG_PROP_KEY,
  setDisplayName,
  wrapDisplayName,
} from '@flopflip/react';
import type { TFlagName, TFlagVariation } from '@flopflip/types';
import type React from 'react';

import { useFlagVariations } from './use-flag-variations';

type InjectedProps = Record<string, TFlagVariation>;

const injectFeatureToggle =
  <OwnProps extends Record<string, unknown>>(
    flagName: TFlagName,
    propKey: string = DEFAULT_FLAG_PROP_KEY,
  ) =>
  (
    Component: React.ComponentType<any>,
  ): React.ComponentType<OwnProps & InjectedProps> => {
    function WrappedComponent(ownProps: OwnProps) {
      const [flagVariation] = useFlagVariations([flagName]);
      const props = {
        ...ownProps,
        [propKey]: flagVariation,
      };

      return <Component {...props} />;
    }

    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle'));

    return WrappedComponent;
  };

export { injectFeatureToggle };
