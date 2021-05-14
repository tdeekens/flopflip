import { components, renderWithAdapter } from '@flopflip/test-utils';
import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from '../../../test-utils';
import Configure from '../../components/configure';
import { STATE_SLICE } from './../../store/constants';
import injectFeatureToggles from './inject-feature-toggles';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });
const FlagsToComponent = (props) => (
  <components.FlagsToComponent {...props} propKey="featureToggles" />
);
const FlagsToComponentWithPropKey = (props) => (
  <components.FlagsToComponent {...props} propKey="onOffs" />
);

describe('injectFeatureToggles', () => {
  describe('without `propKey`', () => {
    it('should have feature enabling prop for `enabledFeature`', async () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { memory: { enabledFeature: true, disabledFeature: false } },
        },
      });
      const TestComponent = injectFeatureToggles([
        'disabledFeature',
        'enabledFeature',
      ])(FlagsToComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
    });

    it('should have feature disabling prop for `disabledFeature`', async () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { memory: { enabledFeature: true, disabledFeature: false } },
        },
      });
      const TestComponent = injectFeatureToggles([
        'disabledFeature',
        'enabledFeature',
      ])(FlagsToComponent);

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const TestComponent = injectFeatureToggles([
          'disabledFeature',
          'enabledFeature',
        ])(FlagsToComponent);
        const store = createStore({
          [STATE_SLICE]: {
            flags: { memory: { enabledFeature: true, disabledFeature: false } },
          },
        });

        const { waitUntilConfigured, changeFlagVariation, queryByFlagName } =
          render(store, <TestComponent />);

        await waitUntilConfigured();

        changeFlagVariation('disabledFeature', true);

        expect(queryByFlagName('disabledFeature')).toHaveTextContent('true');
      });
    });
  });

  describe('with `propKey`', () => {
    it('should have feature enabling prop for `enabledFeature`', async () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { memory: { enabledFeature: true, disabledFeature: false } },
        },
      });
      const TestComponent = injectFeatureToggles(
        ['disabledFeature', 'enabledFeature'],
        'onOffs'
      )(FlagsToComponentWithPropKey);

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('enabledFeature')).toHaveTextContent('true');
    });

    it('should have feature disabling prop for `disabledFeature`', async () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { memory: { enabledFeature: true, disabledFeature: false } },
        },
      });
      const TestComponent = injectFeatureToggles(
        ['disabledFeature', 'enabledFeature'],
        'onOffs'
      )(FlagsToComponentWithPropKey);

      const { waitUntilConfigured, queryByFlagName } = render(
        store,
        <TestComponent />
      );

      await waitUntilConfigured();

      expect(queryByFlagName('disabledFeature')).toHaveTextContent('false');
    });
  });
});
