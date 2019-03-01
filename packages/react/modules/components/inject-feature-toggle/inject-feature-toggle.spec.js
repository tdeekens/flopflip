import React from 'react';
import { render } from '@flopflip/test-utils';
import { ALL_FLAGS_PROP_KEY } from '../../constants';
import injectFeatureToggle from './inject-feature-toggle';

describe('injecting', () => {
  const flagName = 'aFeatureToggle';
  const createTestProps = custom => ({
    [ALL_FLAGS_PROP_KEY]: { [flagName]: true },
    ...custom,
  });

  let Component;

  describe('with `propKey`', () => {
    let props;
    const propKey = 'fooFlagPropName';
    const TestComponent = props => (
      <div data-flag-name={propKey}>{String(props[propKey])}</div>
    );

    beforeEach(() => {
      props = createTestProps();

      Component = injectFeatureToggle(flagName, propKey)(TestComponent);
    });

    it("should pass the feature toggle's state as a `prop` of `propKey`", () => {
      const { queryByFlagName } = render(<Component {...props} />);

      expect(queryByFlagName(propKey)).toHaveTextContent('true');
    });
  });

  describe('without `propKey`', () => {
    let props;
    const TestComponent = props => (
      <div data-flag-name="isFeatureEnabled">
        {String(props.isFeatureEnabled)}
      </div>
    );

    beforeEach(() => {
      props = createTestProps();

      Component = injectFeatureToggle(flagName)(TestComponent);
    });

    it("should pass the feature toggle's state as a `prop` of `isFeatureEnabled`", () => {
      const { queryByFlagName } = render(<Component {...props} />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
    });
  });

  describe('with non defined flagName', () => {
    let props;
    const TestComponent = props => (
      <div data-flag-name="isFeatureEnabled">
        {String(props.isFeatureEnabled)}
      </div>
    );

    beforeEach(() => {
      const anotherFlagName = 'anotherFeatureToggle';
      props = createTestProps();

      Component = injectFeatureToggle(anotherFlagName)(TestComponent);
    });

    it("should pass the feature toggle's state as `false`", () => {
      const { queryByFlagName } = render(<Component {...props} />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('false');
    });
  });

  describe('with multi variate flag', () => {
    let props;
    const TestComponent = props => (
      <div data-flag-name={flagName}>{String(props[flagName])}</div>
    );

    beforeEach(() => {
      props = createTestProps({ [flagName]: 'blue' });

      Component = injectFeatureToggle(flagName)(TestComponent);
    });

    it("should pass the feature toggle's state as the value", () => {
      const { queryByFlagName } = render(<Component {...props} />);

      expect(queryByFlagName(flagName)).toHaveTextContent('blue');
    });
  });
});
