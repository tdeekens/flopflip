import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled, {
  defaultFlagName,
} from '../helpers/is-feature-enabled';

const branchUntoggled = (
  UntoggledComponent,
  flagName = defaultFlagName,
  flagVariate = true,
  defaultVariateValue
) =>
  branch(
    props =>
      !isFeatureEnabled(flagName, flagVariate, defaultVariateValue)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
