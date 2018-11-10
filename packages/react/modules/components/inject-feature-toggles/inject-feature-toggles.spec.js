import React from 'react';
import { mount } from 'enzyme';
import { ALL_FLAGS_PROP_KEY, DEFAULT_FLAGS_PROP_KEY } from '../../constants';
import injectFeatureToggles, {
  areOwnPropsEqual,
} from './inject-feature-toggles';

describe('injecting', () => {
  const TestComponent = () => <React.Fragment>Test</React.Fragment>;
  TestComponent.displayName = 'TestComponent';
  TestComponent.propTypes = {};

  const featureToggle = 'aFeatureToggle';
  const createTestProps = custom => ({
    [ALL_FLAGS_PROP_KEY]: { [featureToggle]: true },
    ...custom,
  });

  describe('with single feature toggle', () => {
    let props;
    let Component;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();

      Component = injectFeatureToggles([featureToggle])(TestComponent);
      wrapper = mount(<Component {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should pass all requested feature toggles as a `prop`', () => {
      expect(wrapper.find(TestComponent)).toHaveProp(
        DEFAULT_FLAGS_PROP_KEY,
        props[ALL_FLAGS_PROP_KEY]
      );
    });

    it("should pass the feature toggle's state as a `prop`", () => {
      expect(wrapper.find(TestComponent)).toHaveProp(DEFAULT_FLAGS_PROP_KEY, {
        [featureToggle]: props[ALL_FLAGS_PROP_KEY][featureToggle],
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
          [ALL_FLAGS_PROP_KEY]: {
            [featureToggle]: true,
            [featureToggle2]: false,
          },
        });

        Component = injectFeatureToggles([featureToggle, featureToggle2])(
          TestComponent
        );
        wrapper = mount(<Component {...props} />);
      });

      it('should pass all requested feature toggles as a `prop`', () => {
        expect(wrapper.find(TestComponent)).toHaveProp(
          DEFAULT_FLAGS_PROP_KEY,
          props[ALL_FLAGS_PROP_KEY]
        );
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
        wrapper = mount(<Component {...props} />);
      });

      it('should pass requested feature toggles as a `prop`', () => {
        expect(wrapper.find(TestComponent)).toHaveProp(DEFAULT_FLAGS_PROP_KEY, {
          [featureToggle]: expect.any(Boolean),
        });
      });

      it("should pass the feature toggle's state as a `prop`", () => {
        expect(wrapper.find(TestComponent)).toHaveProp(DEFAULT_FLAGS_PROP_KEY, {
          [featureToggle]: props[ALL_FLAGS_PROP_KEY][featureToggle],
        });
      });

      it('should omit requested but non existent feature toggles from `props`', () => {
        expect(wrapper.find(TestComponent)).not.toHaveProp(
          DEFAULT_FLAGS_PROP_KEY,
          {
            [nonExistingFeatureToggle]: expect.any(Boolean),
          }
        );
      });
    });

    describe('with `propKey`', () => {
      beforeEach(() => {
        props = createTestProps({
          [ALL_FLAGS_PROP_KEY]: {
            [featureToggle]: true,
            [featureToggle2]: false,
          },
        });

        Component = injectFeatureToggles(
          [featureToggle, featureToggle2],
          'fooPropKey'
        )(TestComponent);
        wrapper = mount(<Component {...props} />);
      });

      it('should map all feature toggles', () => {
        expect(wrapper.find(TestComponent)).toHaveProp(
          'fooPropKey',
          props[ALL_FLAGS_PROP_KEY]
        );
      });
    });
  });
});

describe('own props equality', () => {
  let ownProps;
  let nextOwnProps;
  const createTestProps = custom => ({
    [DEFAULT_FLAGS_PROP_KEY]: {
      flagA: true,
      flagB: false,
    },
    propA: true,
    propB: 'foo',
    ...custom,
  });

  describe('without feature flags change', () => {
    describe('without other props changes', () => {
      beforeEach(() => {
        ownProps = createTestProps();
        nextOwnProps = createTestProps();
      });

      it('should indicate equality in own props', () => {
        expect(
          areOwnPropsEqual(nextOwnProps, ownProps, DEFAULT_FLAGS_PROP_KEY)
        ).toBe(true);
      });
    });

    describe('with other prop changes', () => {
      beforeEach(() => {
        ownProps = createTestProps();
        nextOwnProps = createTestProps({ propC: false });
      });

      it('should indicate difference in own props', () => {
        expect(
          areOwnPropsEqual(nextOwnProps, ownProps, DEFAULT_FLAGS_PROP_KEY)
        ).toBe(false);
      });
    });
  });
  describe('with feature flags change', () => {
    describe('without other props changes', () => {
      beforeEach(() => {
        ownProps = createTestProps();
        nextOwnProps = createTestProps({
          [DEFAULT_FLAGS_PROP_KEY]: { flagC: true },
        });
      });
      it('should indicate difference in own props', () => {
        expect(
          areOwnPropsEqual(nextOwnProps, ownProps, DEFAULT_FLAGS_PROP_KEY)
        ).toBe(false);
      });
    });
    describe('with other props changes', () => {
      beforeEach(() => {
        ownProps = createTestProps();
        nextOwnProps = createTestProps({
          [DEFAULT_FLAGS_PROP_KEY]: { flagC: true },
          propC: false,
        });
      });

      it('should indicate differnce in own props', () => {
        expect(
          areOwnPropsEqual(nextOwnProps, ownProps, DEFAULT_FLAGS_PROP_KEY)
        ).toBe(false);
      });
    });
  });
});
