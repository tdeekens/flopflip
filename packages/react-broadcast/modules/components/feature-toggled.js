import { compose, withProps } from 'recompose';
import { FeatureToggled, isFeatureEnabled } from '@flopflip/react';
import withSubscription from './with-subscription';

export default compose(
  withSubscription('availableFeatureToggles'),
  withProps(props => ({
    isFeatureEnabled: isFeatureEnabled(
      props.flag,
      props.variate,
      props.defaultVariateValue
    )(props),
  }))
)(FeatureToggled);
