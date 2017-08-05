import React from 'react';
import { shallow } from 'enzyme';
import injectFeatureToggles from './inject-feature-toggles';

describe('injecting', () => {
  const TestComponent = () =>
    <div>
      {'Test'}
    </div>;
  TestComponent.displayName = 'TestComponent';
  TestComponent.propTypes = {};

  describe('with single feature toggle', () => {
    const featureToggle = 'aFeatureToggle';
    let featureToggles;
    let Component;
    let wrapper;

    beforeEach(() => {
      featureToggles = { [featureToggle]: true };

      Component = injectFeatureToggles([featureToggle])(TestComponent);
      wrapper = shallow(<Component availableFeatureToggles={featureToggles} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should pass all requested feature toggles as a `prop`', () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        'featureToggles',
        featureToggles
      );
    });

    it("should pass the feature toggle's state as a `prop`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp('featureToggles', {
        [featureToggle]: featureToggles[featureToggle],
      });
    });
  });

  describe('with multiple feature toggles', () => {
    const featureToggle = 'aFeatureToggle';
    let featureToggles;
    let Component;
    let wrapper;

    describe('with all toggles defined', () => {
      beforeEach(() => {
        featureToggles = { [featureToggle]: true };

        Component = injectFeatureToggles([featureToggle])(TestComponent);
        wrapper = shallow(
          <Component availableFeatureToggles={featureToggles} />
        );
      });

      it('should pass all requested feature toggles as a `prop`', () => {
        expect(wrapper.find(TestComponent)).toHaveProp(
          'featureToggles',
          featureToggles
        );
      });

      it("should pass the feature toggle's state as a `prop`", () => {
        expect(wrapper.find(TestComponent)).toHaveProp('featureToggles', {
          [featureToggle]: featureToggles[featureToggle],
        });
      });
    });

    describe('without all toggles defined', () => {
      let nonExistingFeatureToggle;
      let existingFeatureToggle;

      beforeEach(() => {
        existingFeatureToggle = featureToggle;
        nonExistingFeatureToggle = 'anotherToggle';

        featureToggles = { [existingFeatureToggle]: true };

        Component = injectFeatureToggles([
          existingFeatureToggle,
          nonExistingFeatureToggle,
        ])(TestComponent);
        wrapper = shallow(
          <Component availableFeatureToggles={featureToggles} />
        );
      });

      it('should pass requested feature toggles as a `prop`', () => {
        expect(wrapper.find(TestComponent)).toHaveProp('featureToggles', {
          [existingFeatureToggle]: expect.any(Boolean),
        });
      });

      it("should pass the feature toggle's state as a `prop`", () => {
        expect(wrapper.find(TestComponent)).toHaveProp('featureToggles', {
          [featureToggle]: featureToggles[existingFeatureToggle],
        });
      });

      it('should omit requested but non existent feature toggles from `props`', () => {
        expect(wrapper.find(TestComponent)).not.toHaveProp('featureToggles', {
          [nonExistingFeatureToggle]: expect.any(Boolean),
        });
      });
    });
  });
});
