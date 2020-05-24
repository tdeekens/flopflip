import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../test-utils';
import { STATE_SLICE } from '../../store/constants';
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
    it('should render receive the flag value as `false`', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });
      const TestComponent = injectFeatureToggle('disabledFeature')(
        components.FlagsToComponent
      );

      const rendered = render(store, <TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveTextContent(
        'false'
      );
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const store = createStore({
          [STATE_SLICE]: { flags: { disabledFeature: false } },
        });
        const TestComponent = injectFeatureToggle('disabledFeature')(
          components.FlagsToComponent
        );

        const rendered = render(store, <TestComponent />);

        await rendered.waitUntilConfigured();

        rendered.changeFlagVariation('disabledFeature', true);

        expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveTextContent(
          'true'
        );
      });
    });
  });

  describe('when feature is enabled', () => {
    it('should render receive the flag value as `true`', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { enabledFeature: true } },
      });
      const TestComponent = injectFeatureToggle('enabledFeature')(
        components.FlagsToComponent
      );

      const rendered = render(store, <TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('isFeatureEnabled')).toHaveTextContent(
        'true'
      );
    });
  });
});

describe('with `propKey`', () => {
  describe('when feature is disabled', () => {
    it('should render receive the flag value as `false`', async () => {
      const store = createStore({
        [STATE_SLICE]: { flags: { disabledFeature: false } },
      });
      const TestComponent = injectFeatureToggle(
        'disabledFeature',
        'customPropKey'
      )(components.FlagsToComponent);

      const rendered = render(store, <TestComponent />);

      await rendered.waitUntilConfigured();

      expect(rendered.queryByFlagName('customPropKey')).toHaveTextContent(
        'false'
      );
    });
  });
});
