import React from 'react';
import { render, components } from '@flopflip/test-utils';
import { ALL_FLAGS_PROP_KEY, DEFAULT_FLAGS_PROP_KEY } from '../../constants';
import injectFeatureToggles from './inject-feature-toggles';
import { defaultAreOwnPropsEqual as areOwnPropsEqual } from './utils';

describe('injecting', () => {
  const firstFlagName = 'aFeatureToggle';
  const createTestProps = custom => ({
    [ALL_FLAGS_PROP_KEY]: { [firstFlagName]: true },
    ...custom,
  });

  describe('with single feature toggle', () => {
    let props;
    let TestComponent;
    const FlagsToComponent = props => (
      <components.FlagsToComponent
        {...props}
        propKey={DEFAULT_FLAGS_PROP_KEY}
      />
    );

    beforeEach(() => {
      props = createTestProps();

      TestComponent = injectFeatureToggles([firstFlagName])(FlagsToComponent);
    });

    it('should pass all requested feature toggles', () => {
      const { queryByFlagName } = render(<TestComponent {...props} />);

      expect(queryByFlagName(firstFlagName)).toBeInTheDocument();
    });
  });

  describe('with multiple feature toggles', () => {
    const secondFlagName = 'aFeatureToggle2';
    let TestComponent;
    const FlagsToComponent = props => (
      <components.FlagsToComponent
        {...props}
        propKey={DEFAULT_FLAGS_PROP_KEY}
      />
    );
    let props;

    describe('with all toggles defined', () => {
      beforeEach(() => {
        props = createTestProps({
          [ALL_FLAGS_PROP_KEY]: {
            [firstFlagName]: true,
            [secondFlagName]: false,
          },
        });

        TestComponent = injectFeatureToggles([firstFlagName, secondFlagName])(
          FlagsToComponent
        );
      });

      it('should pass all requested feature toggles', () => {
        const { queryByFlagName } = render(<TestComponent {...props} />);

        expect(queryByFlagName(firstFlagName)).toBeInTheDocument();
        expect(queryByFlagName(secondFlagName)).toBeInTheDocument();
      });
    });

    describe('without all toggles defined', () => {
      let nonExistingFlagName;
      let props;

      beforeEach(() => {
        props = createTestProps();
        nonExistingFlagName = 'anotherToggle';

        TestComponent = injectFeatureToggles([
          firstFlagName,
          nonExistingFlagName,
        ])(FlagsToComponent);
      });

      it('should pass all requested feature toggles', () => {
        const { queryByFlagName } = render(<TestComponent {...props} />);

        expect(queryByFlagName(firstFlagName)).toBeInTheDocument();
      });

      it('should omit requested but non existent feature toggles from `props`', () => {
        const { queryByFlagName } = render(<TestComponent {...props} />);

        expect(queryByFlagName(nonExistingFlagName)).not.toBeInTheDocument();
      });
    });

    describe('with `propKey`', () => {
      beforeEach(() => {
        const FlagsToComponent = props => (
          <components.FlagsToComponent {...props} propKey="fooPropKey" />
        );

        props = createTestProps({
          [ALL_FLAGS_PROP_KEY]: {
            [firstFlagName]: true,
            [secondFlagName]: false,
          },
        });

        TestComponent = injectFeatureToggles(
          [firstFlagName, secondFlagName],
          'fooPropKey'
        )(FlagsToComponent);
      });

      it('should pass all requested feature toggles', () => {
        const { queryByFlagName } = render(<TestComponent {...props} />);

        expect(queryByFlagName(firstFlagName)).toBeInTheDocument();
        expect(queryByFlagName(secondFlagName)).toBeInTheDocument();
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
