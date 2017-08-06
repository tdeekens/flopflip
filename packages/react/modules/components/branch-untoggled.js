import { branch, renderNothing, renderComponent } from 'recompose';

const branchUntoggled = (UntoggledComponent, flagName = 'isFeatureEnabled') =>
  branch(
    props => !props[flagName],
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
