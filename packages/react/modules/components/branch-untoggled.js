import { branch, renderNothing, renderComponent } from 'recompose';

const branchUntoggled = UntoggledComponent =>
  branch(
    ({ flagName = 'isFeatureEnabled', ...props }) => !props[flagName],
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
