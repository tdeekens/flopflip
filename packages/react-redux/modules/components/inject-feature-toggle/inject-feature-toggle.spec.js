import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { STATE_SLICE } from '../../store';
import injectFeatureToggle from './inject-feature-toggle';
import Configure from '../configure';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

const createMockStore = configureStore();

describe('without `propKey`', () => {
  describe('when feature is disabled', () => {
    let store;
    const TestComponent = injectFeatureToggle('disabledFeature')(
      components.FlagsToComponent
    );

    beforeEach(() => {
      store = createMockStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });
    });

    it('should render receive the flag value as `false`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('false');
    });
  });

  describe('when feature is enabled', () => {
    let store;
    const TestComponent = injectFeatureToggle('enabledFeature')(
      components.FlagsToComponent
    );

    beforeEach(() => {
      store = createMockStore({
        [STATE_SLICE]: { flags: { enabledFeature: true } },
      });
    });

    it('should render receive the flag value as `true`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
    });
  });
});

describe('with `propKey`', () => {
  describe('when feature is disabled', () => {
    let store;
    const TestComponent = injectFeatureToggle(
      'disabledFeature',
      'customPropKey'
    )(components.FlagsToComponent);

    beforeEach(() => {
      store = createMockStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });
    });

    it('should render receive the flag value as `false`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('customPropKey')).toHaveTextContent('false');
    });
  });
});
