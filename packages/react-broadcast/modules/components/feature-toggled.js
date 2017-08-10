import { compose, withProps } from 'recompose';
import isNil from 'lodash.isnil';
import { FeatureToggled } from '@flopflip/react';
import withSubscription from './with-subscription';

export default compose(
  withSubscription('availableFeatureToggles'),
  withProps(props => {
    const flagValue = props.availableFeatureToggles[props.flag];

    return { isFeatureEnabled: isNil(flagValue) ? false : flagValue };
  })
)(FeatureToggled);
