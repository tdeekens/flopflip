import { Provider } from 'react-redux';
import React from 'react';
import { renderWithAdapter, components } from '@flopflip/test-utils';
import { createStore } from '../../../test-utils';
import Configure from '../configure';
import { STATE_SLICE } from './../../store/constants';
import injectFeatureToggles from './inject-feature-toggles';

const render = (store, TestComponent) =>
  renderWithAdapter(TestComponent, {
    components: {
      ConfigureFlopFlip: Configure,
      Wrapper: <Provider store={store} />,
    },
  });
const FlagsToComponent = props => (
  <components.FlagsToComponent {...props} propKey="featureToggles" />
);
const FlagsToComponentWithPropKey = props => (
  <components.FlagsToComponent {...props} propKey="onOffs" />
);

describe('injectFeatureToggles', () => {
  describe('without `propKey`', () => {
    it('should have feature enabling prop for `enabledFeature`', () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
      const TestComponent = injectFeatureToggles([
        'disabledFeature',
        'enabledFeature',
      ])(FlagsToComponent);

      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('enabledFeature')).toHaveTextContent(
        'true'
      );
    });

    it('should have feature disabling prop for `disabledFeature`', () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
      const TestComponent = injectFeatureToggles([
        'disabledFeature',
        'enabledFeature',
      ])(FlagsToComponent);

      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
        'false'
      );
    });

    describe('when enabling feature', () => {
      it('should render the component representing a enabled feature', async () => {
        const TestComponent = injectFeatureToggles([
          'disabledFeature',
          'enabledFeature',
        ])(FlagsToComponent);
        const store = createStore({
          [STATE_SLICE]: {
            flags: { enabledFeature: true, disabledFeature: false },
          },
        });

        const rendered = render(store, <TestComponent />);

        await rendered.waitUntilReady();

        rendered.changeFlagVariation('disabledFeature', true);

        expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
          'true'
        );
      });
    });
  });

  describe('with `propKey`', () => {
    it('should have feature enabling prop for `enabledFeature`', () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
      const TestComponent = injectFeatureToggles(
        ['disabledFeature', 'enabledFeature'],
        'onOffs'
      )(FlagsToComponentWithPropKey);

      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('enabledFeature')).toHaveTextContent(
        'true'
      );
    });

    it('should have feature disabling prop for `disabledFeature`', () => {
      const store = createStore({
        [STATE_SLICE]: {
          flags: { enabledFeature: true, disabledFeature: false },
        },
      });
      const TestComponent = injectFeatureToggles(
        ['disabledFeature', 'enabledFeature'],
        'onOffs'
      )(FlagsToComponentWithPropKey);

      const rendered = render(store, <TestComponent />);

      expect(rendered.queryByFlagName('disabledFeature')).toHaveTextContent(
        'false'
      );
    });
  });
});
