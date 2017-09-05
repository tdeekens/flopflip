import React from 'react';
import { shallow } from 'enzyme';
import { ALL_FLAGS } from '../constants';
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
      expect(wrapper).toHaveProp('featureToggles', props[ALL_FLAGS]);
    });

    it("should pass the feature toggle's state as a `prop`", () => {
      expect(wrapper).toHaveProp('featureToggles', {
        [featureToggle]: props[ALL_FLAGS][featureToggle],
      });
    });
  });

  describe('with multiple feature toggles', () => {
    let Component;
    let props;
    let wrapper;

    describe('with all toggles defined', () => {
      beforeEach(() => {
        props = createTestProps();

        Component = injectFeatureToggles([featureToggle])(TestComponent);
        wrapper = shallow(<Component {...props} />);
      });

      it('should pass all requested feature toggles as a `prop`', () => {
        expect(wrapper).toHaveProp('featureToggles', props[ALL_FLAGS]);
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
        expect(wrapper).toHaveProp('featureToggles', {
          [featureToggle]: expect.any(Boolean),
        });
      });

      it("should pass the feature toggle's state as a `prop`", () => {
        expect(wrapper).toHaveProp('featureToggles', {
          [featureToggle]: props[ALL_FLAGS][featureToggle],
        });
      });

      it('should omit requested but non existent feature toggles from `props`', () => {
        expect(wrapper).not.toHaveProp('featureToggles', {
          [nonExistingFeatureToggle]: expect.any(Boolean),
        });
      });
    });
  });
});
