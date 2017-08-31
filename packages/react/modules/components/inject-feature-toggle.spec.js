import React from 'react';
import { shallow } from 'enzyme';
import injectFeatureToggle from './inject-feature-toggle';

describe('injecting', () => {
  const TestComponent = () => <div>{'Test'}</div>;
  TestComponent.displayName = 'TestComponent';
  TestComponent.propTypes = {};

  const flagName = 'aFeatureToggle';
  let availableFeatureToggles;
  let Component;
  let wrapper;

  describe('with `propKey`', () => {
    const propKey = 'fooFlagPropName';

    beforeEach(() => {
      availableFeatureToggles = { [flagName]: true };

      Component = injectFeatureToggle(flagName, propKey)(TestComponent);
      wrapper = shallow(
        <Component availableFeatureToggles={availableFeatureToggles} />
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should pass the feature toggle's state as a `prop` of `propKey`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        propKey,
        availableFeatureToggles[flagName]
      );
    });
  });

  describe('without `propKey`', () => {
    beforeEach(() => {
      availableFeatureToggles = { [flagName]: true };

      Component = injectFeatureToggle(flagName)(TestComponent);
      wrapper = shallow(
        <Component availableFeatureToggles={availableFeatureToggles} />
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should pass the feature toggle's state as a `prop` of `isFeatureEnabled`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        'isFeatureEnabled',
        availableFeatureToggles[flagName]
      );
    });
  });

  describe('with non defined flagName', () => {
    beforeEach(() => {
      const anotherFlagName = 'anotherFeatureToggle';
      availableFeatureToggles = { [flagName]: true };

      Component = injectFeatureToggle(anotherFlagName)(TestComponent);
      wrapper = shallow(
        <Component availableFeatureToggles={availableFeatureToggles} />
      );
    });

    it("should pass the feature toggle's state as `false`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp('isFeatureEnabled', false);
    });
  });

  describe('with multivariate flag', () => {
    beforeEach(() => {
      availableFeatureToggles = { [flagName]: 'blue' };

      Component = injectFeatureToggle(flagName)(TestComponent);
      wrapper = shallow(
        <Component availableFeatureToggles={availableFeatureToggles} />
      );
    });

    it("should pass the feature toggle's state as the value", () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        'isFeatureEnabled',
        'blue'
      );
    });
  });
});
