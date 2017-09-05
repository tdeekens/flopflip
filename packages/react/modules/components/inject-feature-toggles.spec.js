import React from 'react';
import { shallow } from 'enzyme';
import { ALL_FLAGS, DEFAULT_FLAGS_PROP_KEY } from '../constants';
import injectFeatureToggles from './inject-feature-toggles';

describe('injecting', () => {
  const TestComponent = () => <div>{'Test'}</div>;
  TestComponent.displayName = 'TestComponent';
  TestComponent.propTypes = {};

  const featureToggle = 'aFeatureToggle';
  const createTestProps = custom => ({
    [ALL_FLAGS]: { [featureToggle]: true },
    ...custom,
  });

  describe('with single feature toggle', () => {
    let props;
    let Component;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();

      Component = injectFeatureToggles([featureToggle])(TestComponent);
      wrapper = shallow(<Component {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should pass all requested feature toggles as a `prop`', () => {
      expect(wrapper).toHaveProp(DEFAULT_FLAGS_PROP_KEY, props[ALL_FLAGS]);
    });

    it("should pass the feature toggle's state as a `prop`", () => {
      expect(wrapper).toHaveProp(DEFAULT_FLAGS_PROP_KEY, {
        [featureToggle]: props[ALL_FLAGS][featureToggle],
      });
    });
  });

  describe('with multiple feature toggles', () => {
    const featureToggle2 = 'aFeatureToggle2';
    let Component;
    let props;
    let wrapper;

    describe('with all toggles defined', () => {
      beforeEach(() => {
        props = createTestProps({
          [ALL_FLAGS]: { [featureToggle]: true, [featureToggle2]: false },
        });

        Component = injectFeatureToggles([featureToggle, featureToggle2])(
          TestComponent
        );
        wrapper = shallow(<Component {...props} />);
      });

      it('should pass all requested feature toggles as a `prop`', () => {
        expect(wrapper).toHaveProp(DEFAULT_FLAGS_PROP_KEY, props[ALL_FLAGS]);
      });
    });

    describe('without all toggles defined', () => {
      let nonExistingFeatureToggle;
      let props;

      beforeEach(() => {
        props = createTestProps();
        nonExistingFeatureToggle = 'anotherToggle';

        Component = injectFeatureToggles([
          featureToggle,
          nonExistingFeatureToggle,
        ])(TestComponent);
        wrapper = shallow(<Component {...props} />);
      });

      it('should pass requested feature toggles as a `prop`', () => {
        expect(wrapper).toHaveProp(DEFAULT_FLAGS_PROP_KEY, {
          [featureToggle]: expect.any(Boolean),
        });
      });

      it("should pass the feature toggle's state as a `prop`", () => {
        expect(wrapper).toHaveProp(DEFAULT_FLAGS_PROP_KEY, {
          [featureToggle]: props[ALL_FLAGS][featureToggle],
        });
      });

      it('should omit requested but non existent feature toggles from `props`', () => {
        expect(wrapper).not.toHaveProp(DEFAULT_FLAGS_PROP_KEY, {
          [nonExistingFeatureToggle]: expect.any(Boolean),
        });
      });
    });

    describe('with `propKey`', () => {
      beforeEach(() => {
        props = createTestProps({
          [ALL_FLAGS]: { [featureToggle]: true, [featureToggle2]: false },
        });

        Component = injectFeatureToggles(
          [featureToggle, featureToggle2],
          'fooPropKey'
        )(TestComponent);
        wrapper = shallow(<Component {...props} />);
      });

      it('should map all feature toggles', () => {
        expect(wrapper).toHaveProp('fooPropKey', props[ALL_FLAGS]);
      });
    });
  });
});
