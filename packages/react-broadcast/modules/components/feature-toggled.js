import { compose, withProps } from 'recompose';
import { FeatureToggled, isFeatureEnabled, ALL_FLAGS } from '@flopflip/react';
import withSubscription from './with-subscription';

export default compose(
  withSubscription(ALL_FLAGS),
  withProps(props => ({
    isFeatureEnabled: isFeatureEnabled(props.flag, props.variate)(props),
  }))
)(FeatureToggled);
