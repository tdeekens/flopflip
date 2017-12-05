import { compose, withProps } from 'recompose';
import {
  ToggleFeature,
  isFeatureEnabled,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';
import withFlagSubscription from '../with-flag-subscription/';

export default compose(
  withFlagSubscription(ALL_FLAGS_PROP_KEY),
  withProps(props => ({
    isFeatureEnabled: isFeatureEnabled(props.flag, props.variation)(
      props[ALL_FLAGS_PROP_KEY]
    ),
  }))
)(ToggleFeature);
