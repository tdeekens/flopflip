import { components, renderWithAdapter } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { Configure } from '../src/configure';
import { STATE_SLICE } from '../src/constants';
import { ToggleFeature } from '../src/toggle-feature';
import { createStore } from './test-utils';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

describe('<ToggleFeature>', () => {
  describe('when feature is disabled', () => {
    it('should not render the component representing a enabled feature', async () => {
      function TestComponent() {
        return (
          <ToggleFeature flag="disabledFeature">
            <components.ToggledComponent flagName="disabledFeature" />
          </ToggleFeature>
        );
      }

      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
      });

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('disabledFeature')).not.toBeInTheDocument();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        function TestComponent() {
          return (
            <ToggleFeature flag="disabledFeature">
              <components.ToggledComponent flagName="disabledFeature" />
            </ToggleFeature>
          );
        }

        const store = createStore({
          [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
        });

        const { waitUntilConfigured, getByFlagName, changeFlagVariation } =
          render(store, <TestComponent />);

        await waitUntilConfigured();

        changeFlagVariation('disabledFeature', true);

        expect(getByFlagName('disabledFeature')).toBeInTheDocument();
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render the component representing a enabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { enabledFeature: true } } },
      });
      function TestComponent() {
        return (
          <ToggleFeature flag="enabledFeature">
            <components.ToggledComponent flagName="enabledFeature" />
          </ToggleFeature>
        );
      }

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('enabledFeature')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });
});
