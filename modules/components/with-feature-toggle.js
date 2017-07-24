import { compose, branch, renderNothing, renderComponent } from 'recompose';
import inject from './inject-feature-toggles';

export const branchUntoggled = UntoggledComponent =>
  branch(
    props => !Object.values(props.featureToggles).some(_ => _),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default (featureToggle, UntoggledComponent) =>
  compose(inject([featureToggle]), branchUntoggled(UntoggledComponent));
