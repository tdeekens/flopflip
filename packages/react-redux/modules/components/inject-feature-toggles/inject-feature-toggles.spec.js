import { Provider } from 'react-redux';
import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import { ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import configureStore from 'redux-mock-store';
import Configure from '../configure';
import { STATE_SLICE } from './../../store';
import { mapStateToProps } from './inject-feature-toggles';
import injectFeatureToggles from './inject-feature-toggles';

describe('mapStateToProps', () => {
  describe('with `flags` ', () => {
    const flags = { flag1: true };
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags },
      };
    });

    it('should map `flags` as `ALL_FLAGS_PROP_KEY` onto `props`', () => {
      expect(mapStateToProps(state)[ALL_FLAGS_PROP_KEY]).toEqual(flags);
    });
  });

  describe('without `flags` ', () => {
    const flags = {};
    let state;

    beforeEach(() => {
      state = {
        [STATE_SLICE]: { flags },
      };
    });

    it('should map `flags` as `ALL_FLAGS_PROP_KEY` onto `props`', () => {
      expect(mapStateToProps(state)[ALL_FLAGS_PROP_KEY]).toEqual(flags);
    });
  });
});

const createMockStore = configureStore();
const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

describe('injectFeatureToggles', () => {
  describe('without `propKey`', () => {
    let store;
    const FlagsToComponent = props => (
      <components.FlagsToComponent {...props} propKey="featureToggles" />
    );
    const TestComponent = injectFeatureToggles([
      'disabledFeature',
      'enabledFeature',
    ])(FlagsToComponent);

    beforeEach(() => {
      store = createMockStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
    });

    it('should have feature enabling prop for `enabledFeature`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
    });

    it('should have feature disabling prop for `disabledFeature`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
    });
  });

  describe('with `propKey`', () => {
    let store;
    const FlagsToComponent = props => (
      <components.FlagsToComponent {...props} propKey="onOffs" />
    );
    const TestComponent = injectFeatureToggles(
      ['disabledFeature', 'enabledFeature'],
      'onOffs'
    )(FlagsToComponent);

    beforeEach(() => {
      store = createMockStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
    });

    it('should have feature enabling prop for `enabledFeature`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
    });

    it('should have feature disabling prop for `disabledFeature`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
    });
  });
});
