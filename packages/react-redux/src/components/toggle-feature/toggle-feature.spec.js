import React from 'react';
import { Provider } from 'react-redux';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import { createStore } from '../../../test-utils';
import Configure from '../configure';
import { STATE_SLICE } from './../../store/constants';
import ToggleFeature from './toggle-feature';

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
      const TestComponent = () => (
        <ToggleFeature flag="disabledFeature">
          <components.ToggledComponent flagName="disabledFeature" />
        </ToggleFeature>
      );
      const store = createStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });

      const rendered = render(store, <TestComponent />);

      await rendered.waitUntilConfigured();

      expect(
        rendered.queryByFlagName('disabledFeature')
      ).not.toBeInTheDocument();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const TestComponent = () => (
          <ToggleFeature flag="disabledFeature">
            <components.ToggledComponent flagName="disabledFeature" />
          </ToggleFeature>
        );
        const store = createStore({
          [STATE_SLICE]: { flags: { disabledFeature: false } },
        });

        const rendered = render(store, <TestComponent />);

        await rendered.waitUntilConfigured();

        rendered.changeFlagVariation('disabledFeature', true);

        expect(rendered.queryByFlagName('disabledFeature')).toBeInTheDocument();
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render the component representing a enabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { enabledFeature: true } },
      });
      const TestComponent = () => (
        <ToggleFeature flag="enabledFeature">
          <components.ToggledComponent flagName="enabledFeature" />
        </ToggleFeature>
      );

      const rendered = render(store, <TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('enabledFeature')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });
});
