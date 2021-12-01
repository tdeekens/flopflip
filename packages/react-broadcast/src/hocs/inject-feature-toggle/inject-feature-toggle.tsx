import { type TFlagName, type TFlagVariation } from '@flopflip/types';
import {
  DEFAULT_FLAG_PROP_KEY,
  setDisplayName,
  wrapDisplayName,
} from '@flopflip/react';
import React from 'react';

import { useFlagVariations } from '../../hooks';

type InjectedProps = Record<string, TFlagVariation>;

export default function injectFeatureToggle<
  OwnProps extends Record<string, unknown>
>(flagName: TFlagName, propKey: string = DEFAULT_FLAG_PROP_KEY) {
  return (
    Component: React.ComponentType<any>
  ): React.ComponentType<OwnProps & InjectedProps> => {
    const WrappedComponent = (ownProps: OwnProps) => {
      const [flagVariation] = useFlagVariations([flagName]);
      const props = {
        ...ownProps,
        [propKey]: flagVariation,
      };

      return <Component {...props} />;
    };

    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle'));

    return WrappedComponent;
  };
}
