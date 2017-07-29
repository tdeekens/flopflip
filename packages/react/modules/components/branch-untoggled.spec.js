import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
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
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render the `UntoggledComponent`', () => {
      expect(wrapper.text()).toBe('UntoggledComponent');
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
      expect(toJson(wrapper)).toMatchSnapshot();
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
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render the `UntoggledComponent`', () => {
      expect(wrapper.text()).not.toBe('UntoggledComponent');
    });
  });
});
