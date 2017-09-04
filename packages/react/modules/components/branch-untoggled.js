import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled, {
  defaultFlagName,
} from '../helpers/is-feature-enabled';

const branchUntoggled = (
  UntoggledComponent,
  flagName = defaultFlagName,
  flagVariate = true
) =>
  branch(
    props => !isFeatureEnabled(flagName, flagVariate)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
