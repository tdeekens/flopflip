import { compose, withProps } from 'recompose';
import intersection from 'lodash.intersection';
import omitProps from '@hocs/omit-props';

const filterFeatureToggles = (availableFeatureToggles, flagNames) =>
  intersection(Object.keys(availableFeatureToggles), flagNames).reduce(
    (featureToggles, featureToggle) => ({
      [featureToggle]: availableFeatureToggles[featureToggle],
    }),
    {}
  );

const injectFeatureToggles = flagNames =>
  compose(
    withProps(props => ({
      featureToggles: filterFeatureToggles(
        props.availableFeatureToggles,
        flagNames
      ),
    })),
    omitProps('availableFeatureToggles')
  );

export default injectFeatureToggles;
