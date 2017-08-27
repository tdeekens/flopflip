import { branch, renderNothing, renderComponent } from 'recompose';
import isUntoggled from '../helpers/is-untoggled';

const branchUntoggled = (
  UntoggledComponent,
  flagName = 'isFeatureEnabled',
  flagVariate = true
) =>
  branch(
    props => isUntoggled(flagName, flagVariate)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
