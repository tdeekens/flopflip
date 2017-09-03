import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled from '../helpers/is-feature-enabled';

const branchUntoggled = (
  UntoggledComponent,
  flagName = 'isFeatureEnabled',
  flagVariate = true
) =>
  branch(
    props => !isFeatureEnabled(flagName, flagVariate)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
