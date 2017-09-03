import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled from '../helpers/is-feature-enabled';

const branchUntoggled = (
  UntoggledComponent,
  flagName = 'isFeatureEnabled',
  flagVariate = true,
  defaultVariateValue
) =>
  branch(
    props =>
      !isFeatureEnabled(flagName, flagVariate, defaultVariateValue)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
