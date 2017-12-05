import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled from '../../helpers/is-feature-enabled';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

const branchOnFeatureToggle = (
  UntoggledComponent,
  flagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation = true
) =>
  branch(
    props => !isFeatureEnabled(flagName, flagVariation)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchOnFeatureToggle;
