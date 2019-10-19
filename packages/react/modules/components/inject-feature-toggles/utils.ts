import { FlagName, Flags } from '@flopflip/types';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';
import isEqual from 'react-fast-compare';
import { getNormalizedFlagName } from '../../helpers';

const defaultAreOwnPropsEqual = <Props extends object>(
  nextOwnProps: Props,
  ownProps: Props,
  propKey: string
): boolean => {
  const featureFlagProps: Flags = ownProps[propKey];
  const remainingProps: Partial<Props> = omit(ownProps, [propKey]);
  const nextFeatureFlagProps: Flags = nextOwnProps[propKey];
  const nextRemainingProps: Partial<Props> = omit(nextOwnProps, [propKey]);

  return (
    isEqual(featureFlagProps, nextFeatureFlagProps) &&
    isEqual(remainingProps, nextRemainingProps)
  );
};

const filterFeatureToggles = (allFlags: Flags, demandedFlags: FlagName[]) =>
  intersection(Object.keys(allFlags), demandedFlags).reduce(
    (featureToggles: Flags, flagName: FlagName) => ({
      ...featureToggles,
      [getNormalizedFlagName(flagName)]: allFlags[
        getNormalizedFlagName(flagName)
      ],
    }),
    {}
  );

export { defaultAreOwnPropsEqual, filterFeatureToggles };
