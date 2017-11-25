import { compose, withProps } from 'recompose';
import {
  FeatureToggled,
  isFeatureEnabled,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';
import withFlagSubscription from '../with-flag-subscription/';

export default compose(
  withFlagSubscription(ALL_FLAGS_PROP_KEY),
  withProps(props => ({
    isFeatureEnabled: isFeatureEnabled(props.flag, props.variate)(
      props[ALL_FLAGS_PROP_KEY]
    ),
  }))
)(FeatureToggled);
