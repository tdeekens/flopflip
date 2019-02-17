import React from 'react';
import flowRight from 'lodash/flowRight';
import { FlagName, FlagVariation } from '@flopflip/types';
import { withProps } from '../../hocs';
import isNil from 'lodash/isNil';
import { omitProps } from '../../hocs';
import { DEFAULT_FLAG_PROP_KEY, ALL_FLAGS_PROP_KEY } from '../../constants';

type InjectedProps = {
  [propKey: string]: boolean;
};

const injectFeatureToggle = <Props extends object>(
  flagName: FlagName,
  propKey: string = DEFAULT_FLAG_PROP_KEY
) => (
  Component: React.ComponentType<Props>
): React.ComponentType<Props & InjectedProps> =>
  flowRight(
    withProps((ownProps: Props) => {
      const flagVariation: FlagVariation =
        ownProps[ALL_FLAGS_PROP_KEY][flagName];

      return { [propKey]: isNil(flagVariation) ? false : flagVariation };
    }),
    omitProps([ALL_FLAGS_PROP_KEY])
  )(Component);

export default injectFeatureToggle;
