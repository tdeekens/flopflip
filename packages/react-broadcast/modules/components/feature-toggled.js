import { compose, withProps } from 'recompose';
import { FeatureToggled } from '@flopflip/react';
import withSubscription from './with-subscription';

export default compose(
  withSubscription('availableFeatureToggles'),
  withProps(props => ({
    isFeatureEnabled: Boolean(props.availableFeatureToggles[props.flag]),
  }))
)(FeatureToggled);
