import { components, renderWithAdapter } from '@flopflip/test-utils';
import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from '../../../test-utils';
import Configure from '../../components/configure';
import { STATE_SLICE } from '../../store/constants';
import branchOnFeatureToggle from './branch-on-feature-toggle';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });

describe('without `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    it('should render neither the component representing an disabled or enabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
      });
      const TestComponent = branchOnFeatureToggle({ flag: 'disabledFeature' })(
        components.ToggledComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).not.toBeInTheDocument();
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const store = createStore({
          [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
        });
        const TestComponent = branchOnFeatureToggle({
          flag: 'disabledFeature',
        })(components.ToggledComponent);

        const { waitUntilConfigured, getByFlagName, changeFlagVariation } =
          render(store, <TestComponent />);

        await waitUntilConfigured();

        changeFlagVariation('disabledFeature', true);

        expect(getByFlagName('isFeatureEnabled')).toBeInTheDocument();
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render the component representing an enabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { enabledFeature: true } } },
      });
      const TestComponent = branchOnFeatureToggle({ flag: 'enabledFeature' })(
        components.ToggledComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });
  });
});

describe('with `untoggledComponent', () => {
  describe('when feature is disabled', () => {
    it('should not render the component representing a enabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
      });
      const TestComponent = branchOnFeatureToggle(
        { flag: 'disabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should render the component representing a disabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { disabledFeature: false } } },
      });
      const TestComponent = branchOnFeatureToggle(
        { flag: 'disabledFeature' },
        components.UntoggledComponent
      )(components.ToggledComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });
  });

  describe('when feature is enabled', () => {
    it('should render the component representing a enabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { enabledFeature: true } } },
      });
      const TestComponent = branchOnFeatureToggle({ flag: 'enabledFeature' })(
        components.ToggledComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).toHaveAttribute(
        'data-flag-status',
        'enabled'
      );
    });

    it('should not render the component representing a disabled feature', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { memory: { enabledFeature: true } } },
      });
      const TestComponent = branchOnFeatureToggle({ flag: 'enabledFeature' })(
        components.ToggledComponent
      );

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('isFeatureEnabled')).not.toHaveAttribute(
        'data-flag-status',
        'disabled'
      );
    });
  });
});
