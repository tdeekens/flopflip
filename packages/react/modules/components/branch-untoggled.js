import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled from '../helpers/is-feature-enabled';
import { DEFAULT_FLAG_NAME } from '../constants';

const branchUntoggled = (
  UntoggledComponent,
  flagName = DEFAULT_FLAG_NAME,
  flagVariate = true
) =>
  branch(
    props => !isFeatureEnabled(flagName, flagVariate)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
