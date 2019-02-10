import flowRight from 'lodash/flowRight';
import {
  ToggleFeature,
  isFeatureEnabled,
  setDisplayName,
  withProps,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';
import { withFlags } from '../configure';

export default flowRight(
  setDisplayName(ToggleFeature.displayName),
  withFlags(),
  withProps(props => ({
    isFeatureEnabled: isFeatureEnabled(props.flag, props.variation)(
      props[ALL_FLAGS_PROP_KEY]
    ),
  }))
)(ToggleFeature);
