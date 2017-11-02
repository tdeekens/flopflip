import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled from '../helpers/is-feature-enabled';
import { DEFAULT_FLAG_PROP_KEY } from '../constants';

const branchOnFeatureToggle = (
  UntoggledComponent,
  flagName = DEFAULT_FLAG_PROP_KEY,
  flagVariate = true
) =>
  branch(
    props => !isFeatureEnabled(flagName, flagVariate)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchOnFeatureToggle;
