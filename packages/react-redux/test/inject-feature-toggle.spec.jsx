import { components, renderWithAdapter } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { Configure } from '../src/configure';
import { STATE_SLICE } from '../src/constants';
import { injectFeatureToggle } from '../src/inject-feature-toggle';
import { createStore } from './test-utils';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

describe('without `propKey`', () => {
  describe('when feature is disabled', () => {
    it('should render receive the flag value as `false`', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
      });
      const TestComponent = injectFeatureToggle('disabledFeature')(
        components.FlagsToComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('false');
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const store = createStore({
          [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
        });
        const TestComponent = injectFeatureToggle('disabledFeature')(
          components.FlagsToComponent
        );

        const { waitUntilConfigured, queryByFlagName, changeFlagVariation } =
          render(store, <TestComponent />);

        await waitUntilConfigured();

        changeFlagVariation('disabledFeature', true);

        expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render receive the flag value as `true`', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { enabledFeature: true } } },
      });
      const TestComponent = injectFeatureToggle('enabledFeature')(
        components.FlagsToComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveTextContent('true');
    });
  });
});

describe('with `propKey`', () => {
  describe('when feature is disabled', () => {
    it('should render receive the flag value as `false`', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
      });
      const TestComponent = injectFeatureToggle(
        'disabledFeature',
        'customPropKey'
      )(components.FlagsToComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('customPropKey')).toHaveTextContent('false');
    });
  });
});
