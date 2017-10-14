import { compose, withProps } from 'recompose';
import { FeatureToggled, isFeatureEnabled, ALL_FLAGS } from '@flopflip/react';
import withFlagSubscription from './with-flag-subscription';

export default compose(
  withFlagSubscription(ALL_FLAGS),
  withProps(props => ({
    isFeatureEnabled: isFeatureEnabled(props.flag, props.variate)(
      props[ALL_FLAGS]
    ),
  }))
)(FeatureToggled);
