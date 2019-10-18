import React from 'react';
import flowRight from 'lodash/flowRight';
import { FlagName, FlagVariation } from '@flopflip/types';
import { withProps } from '../../hocs';
import isNil from 'lodash/isNil';
import { omitProps } from '../../hocs';
import getNormalizedFlagName from '../utils/get-normalized-flag-name';
import { DEFAULT_FLAG_PROP_KEY, ALL_FLAGS_PROP_KEY } from '../../constants';

type InjectedProps = {
  [propKey: string]: FlagVariation;
};

const injectFeatureToggle = <Props extends object>(
  flagName: FlagName,
  propKey: string = DEFAULT_FLAG_PROP_KEY
) => (
  Component: React.ComponentType<any>
): React.ComponentType<Props & InjectedProps> =>
  // @ts-ignore
  flowRight(
    withProps<Props, InjectedProps>((ownProps: Props) => {
      const flagVariation: FlagVariation =
        ownProps[ALL_FLAGS_PROP_KEY][getNormalizedFlagName(flagName)];

      return { [propKey]: isNil(flagVariation) ? false : flagVariation };
    }),
    omitProps<Props>([ALL_FLAGS_PROP_KEY])
  )(Component);

export default injectFeatureToggle;
