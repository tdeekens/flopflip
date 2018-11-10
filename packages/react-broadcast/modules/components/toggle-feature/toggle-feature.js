// @flow

import { withProps } from 'recompose';
import flowRight from 'lodash.flowright';
import {
  ToggleFeature,
  isFeatureEnabled,
  setDisplayName,
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
