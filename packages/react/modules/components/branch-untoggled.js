import { branch, renderNothing, renderComponent } from 'recompose';

const branchUntoggled = UntoggledComponent =>
  branch(
    props => !Object.values(props.featureToggles).some(_ => _),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchUntoggled;
