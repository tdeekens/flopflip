import { compose, withProps } from 'recompose';
import { FeatureToggled, isUntoggled } from '@flopflip/react';
import withSubscription from './with-subscription';

export default compose(
  withSubscription('availableFeatureToggles'),
  withProps(props => ({
    isFeatureEnabled: !isUntoggled(props.flag, props.variate)(props),
  }))
)(FeatureToggled);
