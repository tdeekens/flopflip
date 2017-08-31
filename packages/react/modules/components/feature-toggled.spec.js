import React from 'react';
import { shallow } from 'enzyme';
import FeatureToggled from './feature-toggled';

const UntoggledComponent = <div>{'UntoggledComponent'}</div>;
const FeatureComponent = () => <div>{'FeatureComponent'}</div>;

describe('with feature disabled', () => {
  describe('with untoggled component', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <FeatureToggled
          isFeatureEnabled={false}
          untoggledComponent={UntoggledComponent}
        >
          <FeatureComponent />
        </FeatureToggled>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the `UntoggledComponent`', () => {
      expect(wrapper).toHaveText('UntoggledComponent');
    });

    it('should not render the `FeatureComponent`', () => {
      expect(wrapper).not.toRender('FeatureComponent');
    });
  });

  describe('without untoggled component', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <FeatureToggled
          isFeatureEnabled
          untoggledComponent={UntoggledComponent}
        >
          <FeatureComponent />
        </FeatureToggled>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the `UntoggledComponent`', () => {
      expect(wrapper).not.toRender('UntoggledComponent');
    });

    it('should render the `FeatureComponent`', () => {
      expect(wrapper).toRender('FeatureComponent');
    });
  });
});
