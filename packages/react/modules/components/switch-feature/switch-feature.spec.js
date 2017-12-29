import React from 'react';
import { shallow } from 'enzyme';
import ToggleFeature from '../toggle-feature';
import SwitchFeature from './switch-feature';

const FeatureComponent = props => (
  <React.Fragment>FeatureComponent {props.nbr}</React.Fragment>
);
FeatureComponent.propTypes = { nbr: PropTypes.number.isRequired };
FeatureComponent.displayName = 'FeatureComponent';

describe('rendering', () => {
  describe('with a feature match', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <SwitchFeature>
          <ToggleFeature isFeatureEnabled variate="foo">
            <FeatureComponent nbr={1} />
          </ToggleFeature>
          <ToggleFeature isFeatureEnabled={false} variate="bar">
            <FeatureComponent nbr={2} />
          </ToggleFeature>
        </SwitchFeature>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the `FeatureComponent`', () => {
      expect(wrapper).toRender(FeatureComponent);
    });

    it('should supply `variate` to the `ToggleFeature`', () => {
      expect(wrapper.find(ToggleFeature)).toHaveProp('variate', 'foo');
    });
  });

  describe('without a feature match', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <SwitchFeature>
          <ToggleFeature isFeatureEnabled={false} variate="foo">
            <FeatureComponent nbr={1} />
          </ToggleFeature>
          <ToggleFeature isFeatureEnabled={false} variate="bar">
            <FeatureComponent nbr={2} />
          </ToggleFeature>
        </SwitchFeature>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render any `FeatureComponent`', () => {
      expect(wrapper).not.toRender(FeatureComponent);
    });
  });

  describe('with multiple feature matchs', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <SwitchFeature>
          <ToggleFeature isFeatureEnabled variate="foo">
            <FeatureComponent nbr={1} />
          </ToggleFeature>
          <ToggleFeature isFeatureEnabled variate="bar">
            <FeatureComponent nbr={2} />
          </ToggleFeature>
        </SwitchFeature>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render one `FeatureComponent`', () => {
      expect(wrapper).toRenderElementTimes(FeatureComponent, 1);
    });

    it('should not render the first `FeatureComponent`', () => {
      expect(wrapper.find(ToggleFeature)).toHaveProp('variate', 'foo');
    });
  });
});
