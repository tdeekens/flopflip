// @flow

import { compose, withProps } from 'recompose';
import {
  ToggleFeature,
  isFeatureEnabled,
  setDisplayName,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';
import { withFlags } from '../configure';

export default compose(
  setDisplayName(ToggleFeature.displayName),
  withFlags(),
  withProps(props => ({
    isFeatureEnabled: isFeatureEnabled(props.flag, props.variation)(
      props[ALL_FLAGS_PROP_KEY]
    ),
  }))
)(ToggleFeature);
