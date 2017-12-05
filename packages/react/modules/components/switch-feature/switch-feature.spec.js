import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import FeatureToggled from '../feature-toggled';
import SwitchFeature from './switch-feature';

const FeatureComponent = props => <div>FeatureComponent {props.nbr}</div>;
FeatureComponent.propTypes = { nbr: PropTypes.number.isRequired };
FeatureComponent.displayName = 'FeatureComponent';

describe('rendering', () => {
  describe('with a feature match', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <SwitchFeature>
          <FeatureToggled isFeatureEnabled variate="foo">
            <FeatureComponent nbr={1} />
          </FeatureToggled>
          <FeatureToggled isFeatureEnabled={false} variate="bar">
            <FeatureComponent nbr={2} />
          </FeatureToggled>
        </SwitchFeature>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the `FeatureComponent`', () => {
      expect(wrapper).toRender(FeatureComponent);
    });

    it('should supply `variate` to the `FeatureToggled`', () => {
      expect(wrapper.find(FeatureToggled)).toHaveProp('variate', 'foo');
    });
  });

  describe('without a feature match', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <SwitchFeature>
          <FeatureToggled isFeatureEnabled={false} variate="foo">
            <FeatureComponent nbr={1} />
          </FeatureToggled>
          <FeatureToggled isFeatureEnabled={false} variate="bar">
            <FeatureComponent nbr={2} />
          </FeatureToggled>
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
          <FeatureToggled isFeatureEnabled variate="foo">
            <FeatureComponent nbr={1} />
          </FeatureToggled>
          <FeatureToggled isFeatureEnabled variate="bar">
            <FeatureComponent nbr={2} />
          </FeatureToggled>
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
      expect(wrapper.find(FeatureToggled)).toHaveProp('variate', 'foo');
    });
  });
});
