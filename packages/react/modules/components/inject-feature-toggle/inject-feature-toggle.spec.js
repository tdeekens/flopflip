import React from 'react';
import { mount } from 'enzyme';
import { ALL_FLAGS_PROP_KEY } from '../../constants';
import injectFeatureToggle from './inject-feature-toggle';

describe('injecting', () => {
  const TestComponent = () => <React.Fragment>Test</React.Fragment>;
  TestComponent.displayName = 'TestComponent';
  TestComponent.propTypes = {};

  const flagName = 'aFeatureToggle';
  const createTestProps = custom => ({
    [ALL_FLAGS_PROP_KEY]: { [flagName]: true },
    ...custom,
  });

  let Component;
  let wrapper;

  describe('with `propKey`', () => {
    let props;
    const propKey = 'fooFlagPropName';

    beforeEach(() => {
      props = createTestProps();

      Component = injectFeatureToggle(flagName, propKey)(TestComponent);
      wrapper = mount(<Component {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should pass the feature toggle's state as a `prop` of `propKey`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        propKey,
        props[ALL_FLAGS_PROP_KEY][flagName]
      );
    });
  });

  describe('without `propKey`', () => {
    let props;

    beforeEach(() => {
      props = createTestProps();

      Component = injectFeatureToggle(flagName)(TestComponent);
      wrapper = mount(<Component {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should pass the feature toggle's state as a `prop` of `isFeatureEnabled`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp('isFeatureEnabled', true);
    });
  });

  describe('with non defined flagName', () => {
    let props;

    beforeEach(() => {
      const anotherFlagName = 'anotherFeatureToggle';
      props = createTestProps();

      Component = injectFeatureToggle(anotherFlagName)(TestComponent);
      wrapper = mount(<Component {...props} />);
    });

    it("should pass the feature toggle's state as `false`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp('isFeatureEnabled', false);
    });
  });

  describe('with multi variate flag', () => {
    let props;

    beforeEach(() => {
      props = createTestProps({ [flagName]: 'blue' });

      Component = injectFeatureToggle(flagName)(TestComponent);
      wrapper = mount(<Component {...props} />);
    });

    it("should pass the feature toggle's state as the value", () => {
      expect(wrapper.find(TestComponent)).toHaveProp(flagName, 'blue');
    });
  });
});
