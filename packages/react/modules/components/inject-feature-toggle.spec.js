import React from 'react';
import { shallow } from 'enzyme';
import injectFeatureToggle from './inject-feature-toggle';

describe('injecting', () => {
  const TestComponent = () =>
    <div>
      {'Test'}
    </div>;
  TestComponent.displayName = 'TestComponent';
  TestComponent.propTypes = {};

  const featureToggle = 'aFeatureToggle';
  let availableFeatureToggles;
  let Component;
  let wrapper;

  beforeEach(() => {
    availableFeatureToggles = { [featureToggle]: true };

    Component = injectFeatureToggle(featureToggle)(TestComponent);
    wrapper = shallow(
      <Component availableFeatureToggles={availableFeatureToggles} />
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should pass the feature toggle's state as a `prop`", () => {
    expect(wrapper.find(TestComponent)).toHaveProp(
      'featureToggle',
      availableFeatureToggles[featureToggle]
    );
  });
});
