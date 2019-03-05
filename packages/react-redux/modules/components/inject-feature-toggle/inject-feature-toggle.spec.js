import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../test-utils';
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

describe('without `propKey`', () => {
  describe('when feature is disabled', () => {
    let store;
    const TestComponent = injectFeatureToggle('disabledFeature')(
      components.FlagsToComponent
    );

    beforeEach(() => {
      store = createStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });
    });

    it('should render receive the flag value as `false`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('false');
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const { queryByFlagName, waitUntilReady, changeFlagVariation } = render(
          store,
          <TestComponent />
        );

        await waitUntilReady();

        changeFlagVariation('disabledFeature', true);

        expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
      });
    });
  });

  describe('when feature is enabled', () => {
    let store;
    const TestComponent = injectFeatureToggle('enabledFeature')(
      components.FlagsToComponent
    );

    beforeEach(() => {
      store = createStore({
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
      store = createStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });
    });

    it('should render receive the flag value as `false`', () => {
      const { queryByFlagName } = render(store, <TestComponent />);

      expect(queryByFlagName('customPropKey')).toHaveTextContent('false');
    });
  });
});
