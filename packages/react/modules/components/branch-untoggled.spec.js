import React from 'react';
import { shallow } from 'enzyme';
import branchUntoggled from './branch-untoggled';

const UntoggledComponent = () =>
  <div>
    {'UntoggledComponent'}
  </div>;
UntoggledComponent.displayName = 'UntoggledComponent';

describe('with feature disabled', () => {
  const featureToggles = {
    aFeatureToggle: false,
  };

  describe('with untoggled component', () => {
    let Component;
    let wrapper;

    beforeEach(() => {
      Component = branchUntoggled(UntoggledComponent)();
      wrapper = shallow(<Component featureToggles={featureToggles} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the `UntoggledComponent`', () => {
      expect(wrapper).toHaveText('UntoggledComponent');
    });
  });

  describe('without untoggled component', () => {
    let Component;
    let wrapper;

    beforeEach(() => {
      Component = branchUntoggled()();
      wrapper = shallow(<Component featureToggles={featureToggles} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render `Nothing`', () => {
      expect(wrapper).toRender('Nothing');
    });
  });
});

describe('with feature enabled', () => {
  const featureToggles = {
    aFeatureToggle: true,
  };

  describe('with untoggled component', () => {
    let Component;
    let wrapper;

    beforeEach(() => {
      Component = branchUntoggled(UntoggledComponent)();
      wrapper = shallow(<Component featureToggles={featureToggles} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render the `UntoggledComponent`', () => {
      expect(wrapper).not.toHaveText('UntoggledComponent');
    });
  });
});
